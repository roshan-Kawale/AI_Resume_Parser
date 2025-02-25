import { NextRequest, NextResponse } from "next/server";
import { updateCandidateStatus } from "@/lib/utils/pinecone";

export async function PUT(req: NextRequest) {
  try {
    const { candidateId, status } = await req.json();

    if (!candidateId || !status) {
      return NextResponse.json(
        { error: "Candidate ID and status are required" },
        { status: 400 }
      );
    }

    await updateCandidateStatus(candidateId, status);

    return NextResponse.json(
      { message: "Candidate status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating candidate status:", error);
    return NextResponse.json(
      { error: "Failed to update candidate status" },
      { status: 500 }
    );
  }
}