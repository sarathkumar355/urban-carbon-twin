export async function POST(req: Request) {
  const body = await req.json();

  const { reductionPercentage } = body;

  const currentYear = new Date().getFullYear();

  const yearlyReduction = reductionPercentage || 1;

  const yearsNeeded = Math.ceil(100 / yearlyReduction);

  const targetYear = currentYear + yearsNeeded;

  return Response.json({
    currentYear,
    yearlyReduction,
    yearsNeeded,
    netZeroYear: targetYear,
  });
}