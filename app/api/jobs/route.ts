import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/src/prisma/db";

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

    const jobs = await db.orm.public.Job
      .where({ userId })
      .all();

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Get jobs error:", error);

    return NextResponse.json(
      { error: "Failed to fetch jobs" },
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
    const company = body.company?.trim();
    const description = body.description?.trim();
    const location = body.location?.trim() || null;
    const url = body.url?.trim() || null;

    if (!title || !company || !description) {
      return NextResponse.json(
        {
          error:
            "Job title, company and description are required",
        },
        { status: 400 }
      );
    }

    const userId = Number(session.user.id);

    const job = await db.orm.public.Job.create({
      title,
      company,
      description,
      location,
      url,
      userId,
    });

    return NextResponse.json(
      {
        message: "Job created successfully",
        job,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create job error:", error);

    return NextResponse.json(
      { error: "Failed to create job" },
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
          { error: "Job ID is required" },
          { status: 400 }
        );
      }
  
      const userId = Number(session.user.id);
      const jobId = Number(id);
  
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
  
      await db.orm.public.Job
        .where({
          id: jobId,
          userId,
        })
        .delete();
  
      return NextResponse.json({
        message: "Job deleted successfully",
      });
    } catch (error) {
      console.error("Delete job error:", error);
  
      return NextResponse.json(
        { error: "Failed to delete job" },
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
  
      const { id, title, company, description, location, url } =
        await request.json();
  
      if (!id || !title?.trim() || !company?.trim() || !description?.trim()) {
        return NextResponse.json(
          {
            error: "Job ID, title, company and description are required",
          },
          { status: 400 }
        );
      }
  
      const userId = Number(session.user.id);
      const jobId = Number(id);
  
      const existingJob = await db.orm.public.Job
        .where({
          id: jobId,
          userId,
        })
        .first();
  
      if (!existingJob) {
        return NextResponse.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }
  
      const updatedJob = await db.orm.public.Job
        .where({
          id: jobId,
          userId,
        })
        .update({
          title: title.trim(),
          company: company.trim(),
          description: description.trim(),
          location: location?.trim() || null,
          url: url?.trim() || null,
        });
  
      return NextResponse.json({
        message: "Job updated successfully",
        job: updatedJob,
      });
    } catch (error) {
      console.error("Update job error:", error);
  
      return NextResponse.json(
        { error: "Failed to update job" },
        { status: 500 }
      );
    }
  }