import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongo";
import Analytics from "../../../models/analytics";

export async function POST(request) {
  const { quiz, user, score, correctResponses, incorrectResponses, status } = await request.json();
  await connectMongoDB();
  console.log("sendData",{quiz, user, score, correctResponses, incorrectResponses, status });
  
  await Analytics.create({quiz, user, score, correctResponses, incorrectResponses, status });
  return NextResponse.json({ message: "Analytics Created" }, { status: 201 });
}

export async function PUT(request) {
  const { username, password } = await request.json();
  await connectMongoDB();
  const userFound = await Analytics.findOne({ username, password });    
  return NextResponse.json({ userFound });
}

