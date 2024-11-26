import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongo";
import User from "../../../models/user";

export async function POST(request) {
  const { name, username, password } = await request.json();
  await connectMongoDB();
  await User.create({ name, username, password });
  return NextResponse.json({ message: "User Created" }, { status: 201 });
}

export async function PUT(request) {
  const { username, password } = await request.json();
  await connectMongoDB();
  const userFound = await User.findOne({ username, password });  
  return NextResponse.json({ userFound });
}

