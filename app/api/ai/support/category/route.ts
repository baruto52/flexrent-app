import { NextResponse } from "next/server";

import OpenAI from "openai";

import { z } from "zod";

import { ratelimit }
from "@/lib/rate-limit";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const schema = z.object({
  title: z.string().min(2).max(200),
});

const allowedCategories = [
  "Werkzeuge",
  "Parkplätze",
  "Garagen",
  "Keller",
  "Lagerräume",
  "Transporter",
  "Anhänger",
  "Maschinen",
  "Fahrzeuge",
  "Baumaschinen",
  "Elektronik",
  "Sonstiges",
];

export async function POST(
  req: Request
) {

  try {

    const ip =
      req.headers.get(
        "x-forwarded-for"
      ) || "anonymous";

    const { success } =
      await ratelimit.limit(ip);

    if (!success) {

      return NextResponse.json(
        {
          error:
            "Zu viele Anfragen",
        },
        {
          status: 429,
        }
      );

    }

    const body =
      await req.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {

      return NextResponse.json(
        {
          error:
            "Ungültiger Titel",
        },
        {
          status: 400,
        }
      );

    }

    const { title } =
      parsed.data;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `
Du kategorisierst Marketplace Listings.

Erlaubte Kategorien:
${allowedCategories.join(", ")}

Antworte ausschließlich als JSON.

Format:
{
  "category": ""
}
`,
          },

          {
            role: "user",

            content: title,
          },
        ],

        temperature: 0.1,

        response_format: {
          type: "json_object",
        },
      });

    const content =
      completion.choices?.[0]
        ?.message?.content;

    if (!content) {

      return NextResponse.json(
        {
          error:
            "Keine AI Antwort",
        },
        {
          status: 500,
        }
      );

    }

    const result =
      JSON.parse(content);

    return NextResponse.json({
      success: true,
      category:
        result.category,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "AI Kategorie Fehler",
      },
      {
        status: 500,
      }
    );

  }
}