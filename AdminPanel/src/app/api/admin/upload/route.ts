import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary uses the CLOUDINARY_URL environment variable automatically
cloudinary.config({
  secure: true
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64 Data URI
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString('base64');
    const dataURI = `data:${file.type || 'image/jpeg'};base64,${base64Image}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'quirkyhome/builder',
      resource_type: 'auto'
    });

    // Return the secure URL from Cloudinary
    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
