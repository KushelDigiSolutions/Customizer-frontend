// /app/api/generate/route.js (Next.js App Router)
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        if (!prompt) {
            return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
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
            return NextResponse.json({ error: errText }, { status: 500 });
        }

        // Return image as base64 string
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        return NextResponse.json({
            image: `data:image/jpeg;base64,${base64}`,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}