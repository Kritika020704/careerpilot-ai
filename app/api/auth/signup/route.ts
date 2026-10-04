import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/src/prisma/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await db.orm.public.User.first({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password before storing it
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.orm.public.User
      .select("id", "email", "name")
      .create({
        name: name?.trim() || null,
        email: normalizedEmail,
        passwordHash,
      });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating your account" },
      { status: 500 }
    );
  }
}