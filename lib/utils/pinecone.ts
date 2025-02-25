import { PineconeClient } from "@pinecone-database/pinecone";
import { generateEmbeddings } from "./gemini";
import { v4 as uuidv4 } from "uuid";
import { Candidate, JobDescription } from "@/app/types";

let pineconeInstance: PineconeClient | null = null;

export async function getPineconeClient() {
  if (!pineconeInstance) {
    pineconeInstance = new PineconeClient();
    await pineconeInstance.init({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pineconeInstance;
}

export async function indexCandidate(candidateData: Candidate) {
  const client = await getPineconeClient();
  const index = client.Index("candidates");

  const textToEmbed = `${candidateData.name} ${candidateData.skills.join(" ")} ${candidateData.experience} ${candidateData.education} ${candidateData.resumeText}`;
  const embeddings = await generateEmbeddings(textToEmbed);

  await index.upsert({
    upsertRequest: {
      vectors: [{
        id: candidateData.id,
        values: embeddings,
        metadata: {
          ...candidateData,
          resumeText: candidateData.resumeText.substring(0, 1000), // Limit text size for metadata
        },
      }],
    },
  });
}

export async function indexJob(jobData: JobDescription) {
  const client = await getPineconeClient();
  const index = client.Index("jobs");

  const textToEmbed = `${jobData.title} ${jobData.description} ${jobData.requiredSkills.join(" ")} ${jobData.experience} ${jobData.education}`;
  const embeddings = await generateEmbeddings(textToEmbed);

  await index.upsert({
    upsertRequest: {
      vectors: [{
        id: jobData.id,
        values: embeddings,
        metadata: jobData,
      }],
    },
  });
}

export async function searchCandidates(query: string, topK: number = 5) {
  const client = await getPineconeClient();
  const index = client.Index("candidates");

  const queryEmbeddings = await generateEmbeddings(query);

  const results = await index.query({
    queryRequest: {
      vector: queryEmbeddings,
      topK,
      includeMetadata: true,
    },
  });

  return results.matches?.map(match => ({
    ...match.metadata,
    relevanceScore: Math.round((match.score || 0) * 100),
  })) || [];
}

export async function updateCandidateStatus(candidateId: string, status: 'new' | 'shortlisted' | 'rejected') {
  const client = await getPineconeClient();
  const index = client.Index("candidates");

  // Fetch current vector
  const queryResponse = await index.fetch({
    ids: [candidateId],
  });

  const currentVector = queryResponse.vectors[candidateId];
  if (!currentVector) {
    throw new Error("Candidate not found");
  }

  // Update metadata with new status
  await index.upsert({
    upsertRequest: {
      vectors: [{
        id: candidateId,
        values: currentVector.values,
        metadata: {
          ...currentVector.metadata,
          status,
          updatedAt: new Date().toISOString(),
        },
      }],
    },
  });
}