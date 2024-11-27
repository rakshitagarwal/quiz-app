import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongo";
import Analytics from "../../../models/analytics";

export async function POST(request) {
  const { quiz, user, score, correctResponses, incorrectResponses, status } = await request.json();
  await connectMongoDB();  
  await Analytics.create({quiz, user, score, correctResponses, incorrectResponses, status });
  return NextResponse.json({ message: "Analytics Created" }, { status: 201 });
}

export async function PUT(request) {
  const { user } = await request.json();
  await connectMongoDB();  
  const analytics = await Analytics.find({ user });
  return NextResponse.json({ analytics });
}
