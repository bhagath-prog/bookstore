import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import { connectDB } from "../../../lib/connectDB";

export async function POST(req: Request) {
  await connectDB();

  const { name, email, password, confirmPassword } = await req.json();
  console.log("asdsdas",name, email, password, confirmPassword)
  if (password !== confirmPassword) {
    return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ message: "Email already registered" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });

  return NextResponse.json({ message: "Signup successful" }, { status: 201 });
}
