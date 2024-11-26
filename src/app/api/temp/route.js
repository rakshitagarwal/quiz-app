
import { NextResponse } from "next/server";
import Quiz from "../../../models/quiz";
import connectMongoDB from "../../../lib/mongo";

export async function POST(request) {
  const { title, description, questions } = await request.json();
  await connectMongoDB();
  await Quiz.create({ title, description, questions });
  return NextResponse.json({ message: "Quiz Created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const quizes = await Quiz.find();
  return NextResponse.json({ quizes });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Quiz.findByIdAndDelete(id);
  return NextResponse.json({ message: "Quiz deleted" }, { status: 200 });
}
