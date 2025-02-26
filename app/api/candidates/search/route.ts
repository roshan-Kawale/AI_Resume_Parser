import { NextRequest, NextResponse } from "next/server";
import { searchCandidates } from "@/lib/utils/pinecone";
import { generateCandidateSummary } from "@/lib/utils/gemini";

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Step 1: Search candidates based on the query
    const candidates = await searchCandidates(query);
    
    // Step 2: Generate summaries for all candidates concurrently
    const enrichedCandidates = await Promise.all(
      candidates.map(async (candidate: any) => {
        const aiEvaluation = await generateCandidateSummary(candidate, query || "");

        return {
          ...candidate,
          aiSummary: aiEvaluation.summary,
          relevanceScore: aiEvaluation.relevanceScore,
          missingSkills: aiEvaluation.missingSkills
        };
      })
    );

    // Step 3: Return enriched candidates to the client
    return NextResponse.json({ candidates: enrichedCandidates });
  } catch (error) {
    console.error("Error searching candidates:", error);
    return NextResponse.json(
      { error: "Failed to search candidates" },
      { status: 500 }
    );
  }
}