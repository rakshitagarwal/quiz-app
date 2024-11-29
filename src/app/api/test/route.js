import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongo";
import Analytics from "../../../models/analytics";

export async function POST(request) {
  const { quiz,quizName,  playedBy,createdBy, score, correctResponses, incorrectResponses, status } = await request.json();
  await connectMongoDB();

  const existingAnalytics = await Analytics.findOne({ quiz, playedBy, createdBy });
  if (existingAnalytics) {
    return NextResponse.json({ message: "Entry already exists", analytics: existingAnalytics }, { status: 200 });
  }

  const newAnalytics = await Analytics.create({ quiz, quizName, playedBy,createdBy, score, correctResponses, incorrectResponses, status });
  return NextResponse.json({ message: "Analytics Created", analytics: newAnalytics }, { status: 201 });
}

export async function PUT(request) {
  const { quiz, playedBy, createdBy } = await request.json();
  await connectMongoDB();

  const analytics = await Analytics.findOne({ quiz, playedBy, createdBy });
  if (!analytics) {
    return NextResponse.json({ message: "No entry found" }, { status: 404 });
  }
  return NextResponse.json({ analytics }, { status: 200 });
}

