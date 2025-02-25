import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function generateEmbeddings(text: string): Promise<number[]> {
  const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await embeddingModel.embedContent(text);
  return result.embedding;
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
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `
    Analyze the following candidate profile${jobDescription ? ' for the given job description' : ''}:

    ${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ''}

    Candidate Profile:
    Name: ${candidateData.name}
    Skills: ${candidateData.skills.join(', ')}
    Experience: ${candidateData.experience}
    Education: ${candidateData.education}
    Resume Text: ${candidateData.resumeText}

    Provide a JSON response with the following structure:
    {
      "summary": "A brief professional summary highlighting key qualifications and experience",
      "relevanceScore": "A number between 0-100 indicating overall strength of the profile${jobDescription ? ' and match with the job requirements' : ''}",
      "missingSkills": ["Key skills that would strengthen the candidate's profile${jobDescription ? ' based on the job requirements' : ''}"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());
    
    return {
      summary: response.summary,
      relevanceScore: response.relevanceScore,
      missingSkills: response.missingSkills,
    };
  } catch (error) {
    console.error('Error generating candidate summary:', error);
    return {
      summary: "Unable to generate summary at this time",
      relevanceScore: 0,
      missingSkills: [],
    };
  }
}