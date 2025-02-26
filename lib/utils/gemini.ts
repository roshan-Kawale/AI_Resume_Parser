import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!);

export async function generateEmbeddings(text: string): Promise<number[]> {
  const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await embeddingModel.embedContent(text);
  // Extract the embedding vector correctly
  if (result && result.embedding && Array.isArray(result.embedding.values)) {
    return result.embedding.values; // Assuming `values` holds the embedding numbers
  } else {
    throw new Error(
      "Failed to generate embeddings or invalid format received."
    );
  }
}

function cleanJSONResponse(response: string): string {
  // Remove markdown formatting (```json, ```), trim extra whitespace
  return response.replace(/```json|```/g, "").trim();
}

export async function generateCandidateSummary(
  candidateData: {
    name: string;
    skills: string[];
    experience: string;
    education: string;
    resumeText: string;
  },
  jobDescription?: string
): Promise<{
  summary: string;
  relevanceScore: number;
  missingSkills: string[];
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Analyze the following candidate profile${
      jobDescription ? " for the given job description" : ""
    }:

    ${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ""}

    Candidate Profile:
    Name: ${candidateData.name}
    Skills: ${candidateData.skills.join(", ")}
    Experience: ${candidateData.experience}
    Education: ${candidateData.education}
    Resume Text: ${candidateData.resumeText}

    Provide a JSON response with the following structure:
    {
      "summary": "A brief professional summary highlighting key qualifications and experience",
      "relevanceScore": "A number between 0-100 indicating overall strength of the profile${
        jobDescription ? " and match with the job requirements" : ""
      }",
      "missingSkills": ["Key skills that would strengthen the candidate's profile${
        jobDescription ? " based on the job requirements" : ""
      }"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const cleanedResponse = cleanJSONResponse(result.response.text());

    const response = JSON.parse(cleanedResponse);

    return {
      summary: response.summary,
      relevanceScore: response.relevanceScore,
      missingSkills: response.missingSkills,
    };
  } catch (error) {
    console.error("Error generating candidate summary:", error);
    return {
      summary: "Unable to generate summary at this time",
      relevanceScore: 0,
      missingSkills: [],
    };
  }
}

export async function generateCandidateProfile(
  candidateData: {
    resumeText: string;
  }
): Promise<{
  skills: string[];
  experience: string;
  education: string;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Analyze the following resume text and extract the following details:

    Resume Text:
    ${candidateData.resumeText}

    Provide a JSON response with the following structure:
    {
      "skills": ["A list of technical and soft skills mentioned in the resume"],
      "experience": "A brief summary of the candidate's professional experience",
      "education": "A brief summary of the candidate's educational qualifications"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const cleanedResponse = cleanJSONResponse(result.response.text());

    const response = JSON.parse(cleanedResponse);

    return {
      skills: response.skills,
      experience: response.experience,
      education: response.education,
    };
  } catch (error) {
    console.error("Error extracting candidate profile:", error);
    return {
      skills: [],
      experience: "Unable to extract experience at this time",
      education: "Unable to extract education at this time",
    };
  }
}

