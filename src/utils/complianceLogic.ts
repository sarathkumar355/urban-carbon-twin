export type ComplianceStatus = "SAFE" | "MODERATE" | "HIGH" | "CRITICAL";

export interface ComplianceResult {
  zone: string;
  pollutionIndex: number;
  regulatoryLimit: number;
  complianceRatio: number;
  status: ComplianceStatus;
  violation: boolean;
  excessPollution: number;
}

export function calculateCompliance(name: string, currentPollution: number, limit: number): ComplianceResult {
  const ratio = currentPollution / limit;
  let status: ComplianceStatus = "SAFE";

  if (ratio > 1) status = "CRITICAL";
  else if (ratio > 0.8) status = "HIGH";
  else if (ratio > 0.5) status = "MODERATE";
  else status = "SAFE";

  return {
    zone: name,
    pollutionIndex: Number(currentPollution.toFixed(1)),
    regulatoryLimit: limit,
    complianceRatio: Number(ratio.toFixed(2)),
    status,
    violation: ratio > 1,
    excessPollution: ratio > 1 ? Number((currentPollution - limit).toFixed(1)) : 0
  };
}

export function getStatusColor(status: ComplianceStatus) {
  switch (status) {
    case "SAFE": return "#22c55e"; // Green
    case "MODERATE": return "#eab308"; // Yellow
    case "HIGH": return "#f97316"; // Orange
    case "CRITICAL": return "#ef4444"; // Red
    default: return "#94a3b8";
  }
}
