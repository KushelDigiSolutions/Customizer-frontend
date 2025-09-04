import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400, headers: corsHeaders }
      );
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "jpeg");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/ultra",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLIENT_API_KEY}`,
          Accept: "image/*",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: errText },
        { status: 500, headers: corsHeaders }
      );
    }

    // Return image as base64 string
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json(
      { image: `data:image/jpeg;base64,${base64}` },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
