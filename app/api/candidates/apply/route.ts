import { NextRequest, NextResponse } from "next/server";
import * as pdfParse from "pdf-parse";
import { v4 as uuidv4 } from "uuid";
import { indexCandidate } from "@/lib/utils/pinecone";
import { generateCandidateSummary } from "@/lib/utils/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    console.log("formData : " , formData);
    
    // Extract form data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const skills = (formData.get("skills") as string).split(",").map(s => s.trim());
    const experience = formData.get("experience") as string;
    const education = formData.get("education") as string;
    const resumeFile = formData.get("resume") as File;

    if (!resumeFile) {
      return NextResponse.json(
        { error: "Resume file is required" },
        { status: 400 }
      );
    }

    // Parse PDF resume
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    // console.log(resumeText);

    // Create candidate data object
    const candidateData = {
      id: uuidv4(),
      name,
      email,
      linkedinUrl,
      skills,
      experience,
      education,
      resumeText,
    };

    // Generate AI summary and evaluation
    const aiEvaluation = await generateCandidateSummary(candidateData);
    
    const enrichedCandidateData = {
      ...candidateData,
      aiSummary: aiEvaluation.summary,
      relevanceScore: aiEvaluation.relevanceScore,
      missingSkills: aiEvaluation.missingSkills,
      status: 'new', // new, shortlisted, rejected
      createdAt: new Date().toISOString(),
    };

    // Index candidate data in Pinecone
    await indexCandidate(enrichedCandidateData);

    return NextResponse.json(
      { message: "Application submitted successfully", candidate: enrichedCandidateData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}