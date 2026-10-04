import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/src/prisma/db";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    const resumes = await db.orm.public.Resume
      .where({ userId })
      .all();

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Get resumes error:", error);

    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = body.title?.trim();
    const fileUrl = body.fileUrl?.trim();
    const cloudinaryPublicId = body.cloudinaryPublicId?.trim();


    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: "Title and file URL are required" },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);

    const resume = await db.orm.public.Resume.create({
      title,
      fileUrl,
      cloudinaryPublicId,
      userId,
    });

    return NextResponse.json(
      {
        message: "Resume created successfully",
        resume,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create resume error:", error);

    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
    try {
      const session = await auth();
  
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
  
      const { id } = await request.json();
  
      if (!id) {
        return NextResponse.json(
          { error: "Resume ID is required" },
          { status: 400 }
        );
      }
  
      const userId = Number(session.user.id);
      const resumeId = Number(id);
  
      const resume = await db.orm.public.Resume
        .where({
          id: resumeId,
          userId,
        })
        .first();
  
      if (!resume) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 }
        );
      }
      if (resume.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(
          resume.cloudinaryPublicId,
          {
            resource_type: "image",
            invalidate: true,
          }
        );
      }
  
      await db.orm.public.Resume.where({
      id: resumeId,
      userId,
      })
      .delete();
  
      return NextResponse.json({
        message: "Resume deleted successfully",
      });
    } catch (error) {
      console.error("Delete resume error:", error);
  
      return NextResponse.json(
        { error: "Failed to delete resume" },
        { status: 500 }
      );
    }
  }