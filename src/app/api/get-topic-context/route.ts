
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("--- Incoming Request ---");
    const requestBody = await req.text();
    console.log("Raw Request Body:", requestBody);

    const data = JSON.parse(requestBody);
    const { chapterName } = data;
    console.log("Extracted chapterName:", chapterName);

    const prompt = `
You are an educational assistant helping students understand real-life applications and interesting facts about math topics.

The user is asking about the topic: "${chapterName}".

If "${chapterName}" is clearly NOT a math topic, please respond with this exact JSON:
{
  "error": "Not a math topic"
}

If "${chapterName}" is a math topic, or if it could potentially be related to mathematics, return a JSON with:

1. One elementary-level real-world example, with a brief explanation and a visual description.
2. One advanced-level real-world example, with a detailed explanation and a visual description.
3. A fun and engaging project related to this topic, including:
   - title
   - step-by-step explanation
   - visual_description
   - YouTube video link (key: video_url)
   - Image link or description (key: image_url)
4. A fun fact with a short explanation and a visual description.

Respond ONLY in the following JSON format:
{
  "real_world_example": {
    "elementary": {
      "example": "...",
      "explanation": "...",
      "visual_description": "..."
    },
    "advanced": {
      "example": "...",
      "explanation": "...",
      "visual_description": "..."
    }
  },
  "fun_project": {
    "title": "...",
    "explanation": "...",
    "visual_description": "...",
    "video_url": "...",
    "image_url": "..."
  },
  "fun_fact": {
    "fact": "...",
    "explanation": "...",
    "visual_description": "..."
  }
}
    `;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an educational assistant skilled at explaining math concepts with real-world examples and engaging visual projects.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("OpenRouter API Error:", errorData);
      return NextResponse.json(
        { error: `Failed to fetch from OpenRouter: ${res.status} - ${errorData}` },
        { status: res.status }
      );
    }

    const dataFromLLM = await res.json();
    const message = dataFromLLM?.choices?.[0]?.message?.content;

    if (!message) {
      console.error("Missing content from LLM response:", dataFromLLM);
      return NextResponse.json({ error: "LLM response missing content." }, { status: 500 });
    }

    let cleaned = message.trim();
    if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7).trim();
    else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3).trim();
    if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3).trim();

    let parsedJSON;
    try {
      parsedJSON = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parsing error:", e, "\nLLM Response:", cleaned);
      return NextResponse.json({ error: "Failed to parse LLM response." }, { status: 500 });
    }

    if (parsedJSON.error === "Not a math topic") {
      return NextResponse.json({ error: "Not a math topic" }, { status: 400 });
    }

    // Validate & Add Fallbacks
    const fallbackVideo = "https://www.youtube.com/watch?v=Z5zpfQ16U8g"; // sample fallback
    const fallbackImage = "https://via.placeholder.com/400x250.png?text=Math+Project";

    if (!parsedJSON.fun_project.video_url) {
      parsedJSON.fun_project.video_url = fallbackVideo;
    }

    if (!parsedJSON.fun_project.image_url) {
      parsedJSON.fun_project.image_url = fallbackImage;
    }

    console.log("✅ Successfully parsed and validated response");
    return NextResponse.json(parsedJSON);
  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ error: "Server error occurred." }, { status: 500 });
  } finally {
    console.log("--- Request Completed ---");
  }
}
