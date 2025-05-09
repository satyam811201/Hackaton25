// /api/dailyQuiz/route.ts or /pages/api/dailyQuiz.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function GET() {
  const prompt = `Generate a math multiple choice question for students in class 1 to 8. Provide JSON with fields: "question", "options" (array of 4), "correctIndex" (0-3), and "classLevel" (1-8). Example:
{
  "question": "What is 5 + 7?",
  "options": ["10", "11", "12", "13"],
  "correctIndex": 2,
  "classLevel": 2
}`;

  console.log("API Request received for /api/dailyQuiz");

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    console.log("OpenAI Completion:", completion); // Inspect the raw AI response

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      console.error("Error: No content received from OpenAI");
      return NextResponse.json({ error: "Failed to get quiz from AI" }, { status: 500 });
    }

    console.log("AI Response Content:", aiResponse);

    const json = JSON.parse(aiResponse);
    console.log("Parsed JSON:", json);
    return NextResponse.json(json);

  } catch (err) {
    console.error("Error generating quiz:", err);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}