import OpenAI from "openai";
import { NextResponse } from "next/server";
import { body } from "framer-motion/client";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are the AI assistant for the UrbanCarbon Twin dashboard.

You ONLY answer using the dashboard data below.

City: Neo Metro

Emissions Data:
- Transport emissions: 4.1 Mt
- Industrial emissions: 5.6 Mt
- Residential emissions: 2.7 Mt

Pollution Hotspots:
1. Industrial District — intensity 85
2. Highway Corridor — intensity 72
3. Urban Center — intensity 64

Simulation Strategies:
- EV adoption reduces transport emissions
- Urban trees reduce residential emissions
- Carbon capture reduces industrial emissions

Rules:
1. Always answer using this dashboard data.
2. Never talk about global pollution.
3. Keep answers short (2–4 sentences).
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    return NextResponse.json(
      { reply: "AI service temporarily unavailable." },
      { status: 200 }
    );
  }
}