import { NextResponse } from "next/server";
import Quiz from "../../../../models/quiz";
import connectMongoDB from "../../../../lib/mongo";

export async function PUT(request, { params }) {
  const { id } = params;
  const { title, description, showResult, quizDuration, questions, createdBy } = await request.json();
  await connectMongoDB();
  const res = await Quiz.findByIdAndUpdate(id, { title, description, showResult, quizDuration, questions, createdBy });
  console.log("res",res);
  
  return NextResponse.json({ message: "Quiz updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const quiz = await Quiz.findOne({ _id: id });
  return NextResponse.json({ quiz }, { status: 200 });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  await Quiz.findByIdAndDelete(id);
  return NextResponse.json({ message: "Quiz deleted" }, { status: 200 });
}
