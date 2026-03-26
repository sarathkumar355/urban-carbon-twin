import { NextResponse } from "next/server";
import { emissionsHistory } from "@/data/emissionsHistory";

export async function GET() {
  try {
    return NextResponse.json(emissionsHistory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch emissions history" }, { status: 500 });
  }
}
