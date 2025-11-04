import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken, createAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    console.log("password: ", password);
    

    // Validation
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/email and password are required" },
        { status: 400 }
      );
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    console.log("user found:", user ? "YES" : "NO");
    if (user) {
      console.log("user.username:", user.username);
      console.log("user has password:", !!user.password);
    }

    if (!user) {
      console.log("RETURNING 401: user not found");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    console.log("verifying password...");
    const isValid = await verifyPassword(password, user.password);
    console.log("password valid:", isValid);

    if (!isValid) {
      console.log("RETURNING 401: invalid password");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email || "",
    });

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

    // Set cookie in response
    response.headers.set("Set-Cookie", createAuthCookie(token));

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
