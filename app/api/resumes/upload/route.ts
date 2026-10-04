import { NextResponse } from "next/server";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    // 1. Check if user is logged in
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get uploaded file
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // 3. Only allow PDFs
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // 4. Limit file size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5 MB" },
        { status: 400 }
      );
    }

    // 5. Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 6. Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: `careerpilot/resumes/${session.user.id}`,
          public_id: `resume-${randomUUID()}.pdf`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    // 7. Return Cloudinary URL
    return NextResponse.json({
      message: "Resume uploaded successfully",
      fileUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}