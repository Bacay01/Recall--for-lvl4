import { auth } from "../../../auth";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const { notes } = await request.json();

    if (!notes || notes.trim().length < 20) {
      return NextResponse.json(
        { error: "Please paste a bit more text to generate from." },
        { status: 400 }
      );
    }

    const prompt = `You are a study assistant. Based on the notes below, generate 6 to 8 flashcards as question-and-answer pairs.

Respond with ONLY valid JSON, no extra text, no markdown formatting, in exactly this shape:
[{"question": "...", "answer": "..."}, ...]

Notes:
"""
${notes}
"""`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const rawText = response.text ?? "";

    // Gemini sometimes wraps JSON in markdown code fences — strip those if present
    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let flashcards;
    try {
      flashcards = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse AI response:", cleaned);
      return NextResponse.json(
        { error: "The AI response wasn't in the expected format. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong generating flashcards." },
      { status: 500 }
    );
  }
}