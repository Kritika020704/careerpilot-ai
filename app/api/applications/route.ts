import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/src/prisma/db";
import { Temporal } from "temporal-polyfill";

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

    const applications = await db.orm.public.Application
      .where({ userId })
      .all();

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Get applications error:", error);

    return NextResponse.json(
      { error: "Failed to fetch applications" },
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

    const jobId = Number(body.jobId);
    const status = body.status?.trim() || "Applied";
    const notes = body.notes?.trim() || null;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);

    // Make sure the job belongs to the logged-in user
    const job = await db.orm.public.Job
      .where({
        id: jobId,
        userId,
      })
      .first();

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const application = await db.orm.public.Application.create({
      jobId,
      userId,
      status,
      notes,
      appliedAt: Temporal.Now.instant(),
    });

    return NextResponse.json(
      {
        message: "Application created successfully",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create application error:", error);

    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
    try {
      const session = await auth();
  
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
  
      const body = await request.json();
  
      const applicationId = Number(body.id);
      const status = body.status?.trim();
      const notes = body.notes?.trim() || null;
  
      if (!applicationId || !status) {
        return NextResponse.json(
          { error: "Application ID and status are required" },
          { status: 400 }
        );
      }
  
      const userId = Number(session.user.id);
  
      const application = await db.orm.public.Application
        .where({
          id: applicationId,
          userId,
        })
        .first();
  
      if (!application) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }
  
      const updatedApplication =
        await db.orm.public.Application
          .where({
            id: applicationId,
            userId,
          })
          .update({
            status,
            notes,
          });
  
      return NextResponse.json({
        message: "Application updated successfully",
        application: updatedApplication,
      });
    } catch (error) {
      console.error("Update application error:", error);
  
      return NextResponse.json(
        { error: "Failed to update application" },
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
  
      const body = await request.json();
      const applicationId = Number(body.id);
  
      if (!applicationId) {
        return NextResponse.json(
          { error: "Application ID is required" },
          { status: 400 }
        );
      }
  
      const userId = Number(session.user.id);
  
      const application = await db.orm.public.Application
        .where({
          id: applicationId,
          userId,
        })
        .first();
  
      if (!application) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }
  
      await db.orm.public.Application
        .where({
          id: applicationId,
          userId,
        })
        .delete();
  
      return NextResponse.json({
        message: "Application deleted successfully",
      });
    } catch (error) {
      console.error("Delete application error:", error);
  
      return NextResponse.json(
        { error: "Failed to delete application" },
        { status: 500 }
      );
    }
  }