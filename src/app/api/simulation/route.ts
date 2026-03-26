import { NextResponse } from "next/server";
import { chennaiBaseData } from "@/data/chennaiRealData";

export async function POST(req: Request) {
  const body = await req.json();
  const traffic = body.traffic ?? body.trafficReduction ?? 0;
  const trees = body.trees ?? body.treesPlanted ?? 0;
  const ev = body.ev ?? body.evAdoption ?? 0;

  const base = chennaiBaseData.totalCO2;

  const transport = base * 0.195 * (1 - (traffic / 100)); // Reducing transport based on traffic reduction
  const treeReduction = base * 0.25 * (trees / 100);
  const evReduction = transport * (ev / 100);

  const total = base + transport - treeReduction - evReduction - (base * 0.195); // Removing double counting by shifting transport correctly

  return NextResponse.json({
    total: Number(total.toFixed(2)),
    transport: Number(transport.toFixed(2)),
    reduction: treeReduction + evReduction,
  });
}