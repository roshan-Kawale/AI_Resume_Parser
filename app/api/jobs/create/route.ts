import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { indexJob } from "@/lib/utils/pinecone";
import { JobDescription } from "@/app/types";

export async function POST(req: NextRequest) {
  try {
    const jobData: JobDescription = await req.json();

    // Add unique ID to job data
    const jobWithId = {
      ...jobData,
      id: uuidv4(),
    };

    // Index job in Pinecone
    await indexJob(jobWithId);

    return NextResponse.json(
      { message: "Job posted successfully", job: jobWithId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error posting job:", error);
    return NextResponse.json(
      { error: "Failed to post job" },
      { status: 500 }
    );
  }
}