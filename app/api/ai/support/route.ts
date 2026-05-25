import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = body.message;

    if (!message) {
      return NextResponse.json(
        {
          error: "Nachricht fehlt",
        },
        {
          status: 400,
        }
      );
    }

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Du bist der offizielle KI-Support von LOQARO.

LOQARO ist ein Premium Marketplace.

Hilf professionell.
Erkenne Scam.
Bleibe hilfreich.
Antworte kurz.
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      });

    const answer =
      completion.choices?.[0]?.message?.content;

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "AI Fehler",
      },
      {
        status: 500,
      }
    );
  }
}