import { NextResponse } from "next/server";
import connectMongoDB from "../../../../lib/mongo";
import Analytics from "../../../../models/analytics";

export async function PUT(request, { params }) {
  const { id, quiz, playedBy, score, correctResponses, incorrectResponses, status } = await request.json();
  await connectMongoDB();
  await Analytics.findByIdAndUpdate(id, {quiz, playedBy, score, correctResponses, incorrectResponses, status });
  return NextResponse.json({ message: "Quiz updated" }, { status: 200 });
}

export async function POST(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const analytics = await Analytics.find({playedBy: id});  
  return NextResponse.json({ analytics }, { status: 200 });
}