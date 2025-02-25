import { NextRequest, NextResponse } from "next/server";
import { searchCandidates } from "@/lib/utils/pinecone";

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

    const candidates = await searchCandidates(query);
    return NextResponse.json({ candidates });
  } catch (error) {
    console.error("Error searching candidates:", error);
    return NextResponse.json(
      { error: "Failed to search candidates" },
      { status: 500 }
    );
  }
}