import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("--- Incoming Topics Request ---");

    const promptForTopics = `
You are a helpful assistant for elementary school teachers. Please suggest a list of 8-12 key topics that are typically covered in elementary mathematics (grades 1-5). Provide each topic as a JSON array of strings.
Example: ["Addition", "Subtraction", "Fractions", ...]
`;

    console.log("Generated Prompt for Topics:", promptForTopics);
    console.log("OpenRouter API Key:", process.env.OPENROUTER_API_KEY ? "Present" : "Missing!");

    console.log("Sending request to OpenRouter for topics...");
    const openRouterStartTime = Date.now();

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // Can use a less expensive model for this
        messages: [
          {
            role: "system",
            content: "You are an expert in elementary mathematics curriculum.",
          },
          {
            role: "user",
            content: promptForTopics,
          },
        ],
      }),
    });

    const openRouterEndTime = Date.now();
    console.log("OpenRouter API request completed in:", openRouterEndTime - openRouterStartTime, "ms");
    console.log("OpenRouter API Status:", res.status);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("OpenRouter API Error Response (Topics):", res.status, errorData);
      return NextResponse.json(
        { error: `Failed to fetch topics from LLM: ${res.status} - ${JSON.stringify(errorData)}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Raw OpenRouter API Response Data (Topics):", JSON.stringify(data, null, 2));

    const topicsContent = data?.choices?.[0]?.message?.content;
    console.log("Extracted 'content' (Topics):", topicsContent);

     if (!topicsContent) {
      console.error("OpenRouter API response missing 'content' (Topics). Full response:", data);
      return NextResponse.json({ error: "LLM response missing topics content." }, { status: 500 });
    }

    try {
      // Remove the code fence:
      const cleanedTopicsContent = topicsContent.replace(/```json\n/g, '').replace(/\n```/g, '');
      const parsedTopics = JSON.parse(cleanedTopicsContent);

       if (!Array.isArray(parsedTopics)) {
        console.error("LLM response was not an array:", parsedTopics);
        return NextResponse.json({ error: "LLM response was not a JSON array." }, { status: 500 });
      }
      console.log("Successfully parsed topics:", parsedTopics);
      return NextResponse.json({ topics: parsedTopics });
    } catch (parseError) {
      console.error("Error parsing topics:", parseError);
      console.error("Problematic topics content:", topicsContent);
      return NextResponse.json({ error: "Failed to parse LLM topics." }, { status: 500 });
    }
  } catch (err) {
    console.error("--- General Server Error (Topics) ---");
    console.error(err);
    return NextResponse.json({ error: "Something went wrong fetching topics." }, { status: 500 });
  } finally {
    console.log("--- Topics Request Completed ---");
  }
}