import data from "@/data/realChennai2026.json";

export async function GET() {
  return Response.json(data);
}