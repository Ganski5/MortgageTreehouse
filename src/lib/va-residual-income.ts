// VA Residual Income calculation logic
// Based on official VA guidelines (VA Lenders Handbook, Chapter 4)

export const VA_REGIONS = ["Northeast", "Midwest", "South", "West"] as const;
export type VARegion = (typeof VA_REGIONS)[number];

// ------------------------------------------------------------
// Threshold tables
// ------------------------------------------------------------

// For loan amounts UNDER $80,000
// Structure: { [region]: [1-person, 2-person, 3-person, 4-person, perExtraPerson] }
const THRESHOLDS_UNDER_80K: Record<VARegion, [number, number, number, number, number]> = {
  Northeast: [390, 654, 788, 888, 921],
  Midwest:   [382, 641, 772, 868, 902],
  South:     [382, 641, 772, 868, 902],
  West:      [425, 713, 859, 967, 1004],
};

// For loan amounts $80,000 and over
// Structure: { [region]: [1-person, 2-person, 3-person, 4-person, perExtraPerson] }
const THRESHOLDS_80K_AND_OVER: Record<VARegion, [number, number, number, number, number]> = {
  Northeast: [450, 755, 909, 1025, 80],
  Midwest:   [441, 738, 889, 1003, 75],
  South:     [441, 738, 889, 1003, 75],
  West:      [491, 823, 990, 1117, 84],
};

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

export interface VAResidualIncomeInputs {
  region: string;
  familySize: number;
  grossMonthlyIncome: number;
  monthlyHousingPayment: number; // PITI
  monthlyDebts: number;
  childSupportAlimony: number;
  estimatedUtilities?: number; // optional, default 0
  otherObligations: number;
  loanAmount: number;
}

export interface VAResidualIncomeResult {
  residualIncome: number;
  requiredThreshold: number;
  passes: boolean;
  surplus: number; // positive = surplus, negative = shortfall
  totalDeductions: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
  explanation: string;
}

// ------------------------------------------------------------
// Core functions
// ------------------------------------------------------------

/**
 * Returns the VA residual income threshold for a given region, family size, and loan amount.
 * Throws if the region is not recognized.
 */
export function getVAResidualIncomeThreshold(
  region: string,
  familySize: number,
  loanAmount: number
): number {
  const normalizedRegion = region.trim() as VARegion;

  if (!VA_REGIONS.includes(normalizedRegion)) {
    throw new Error(
      `Unknown VA region: "${region}". Valid regions are: ${VA_REGIONS.join(", ")}.`
    );
  }

  const table =
    loanAmount < 80_000
      ? THRESHOLDS_UNDER_80K[normalizedRegion]
      : THRESHOLDS_80K_AND_OVER[normalizedRegion];

  const clampedSize = Math.max(1, Math.round(familySize));

  if (clampedSize <= 4) {
    return table[clampedSize - 1];
  }

  // Family size over 4: start from the 4-person threshold and add per-extra-person amount
  const extraPersons = clampedSize - 4;
  return table[3] + extraPersons * table[4];
}

/**
 * Calculates VA residual income and returns a detailed result object.
 */
export function calculateVAResidualIncome(
  inputs: VAResidualIncomeInputs
): VAResidualIncomeResult {
  const {
    region,
    familySize,
    grossMonthlyIncome,
    monthlyHousingPayment,
    monthlyDebts,
    childSupportAlimony,
    estimatedUtilities = 0,
    otherObligations,
    loanAmount,
  } = inputs;

  const utilities = estimatedUtilities ?? 0;

  const totalDeductions =
    monthlyHousingPayment +
    monthlyDebts +
    childSupportAlimony +
    utilities +
    otherObligations;

  const residualIncome = grossMonthlyIncome - totalDeductions;

  const requiredThreshold = getVAResidualIncomeThreshold(region, familySize, loanAmount);

  const passes = residualIncome >= requiredThreshold;
  const surplus = residualIncome - requiredThreshold;

  // Build breakdown
  const breakdown: VAResidualIncomeResult["breakdown"] = [
    { label: "Gross Monthly Income", amount: grossMonthlyIncome },
    { label: "Monthly Housing Payment (PITI)", amount: -monthlyHousingPayment },
    { label: "Monthly Debts", amount: -monthlyDebts },
    { label: "Child Support / Alimony", amount: -childSupportAlimony },
    { label: "Estimated Utilities", amount: -utilities },
    { label: "Other Obligations", amount: -otherObligations },
    { label: "Residual Income", amount: residualIncome },
  ];

  // Plain-English explanation
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  let explanation: string;
  if (passes) {
    explanation =
      `The borrower's residual income of ${fmt(residualIncome)} meets or exceeds the VA ` +
      `minimum threshold of ${fmt(requiredThreshold)} for a family of ${familySize} in the ` +
      `${region} region (loan amount ${fmt(loanAmount)}). ` +
      `There is a surplus of ${fmt(surplus)}.`;
  } else {
    explanation =
      `The borrower's residual income of ${fmt(residualIncome)} falls SHORT of the VA ` +
      `minimum threshold of ${fmt(requiredThreshold)} for a family of ${familySize} in the ` +
      `${region} region (loan amount ${fmt(loanAmount)}). ` +
      `The shortfall is ${fmt(Math.abs(surplus))}. ` +
      `Additional income or reduced obligations are needed to qualify.`;
  }

  return {
    residualIncome,
    requiredThreshold,
    passes,
    surplus,
    totalDeductions,
    breakdown,
    explanation,
  };
}
