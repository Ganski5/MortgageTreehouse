// FHA Streamline Refinance calculation logic
// Based on HUD/FHA guidelines for FHA-to-FHA streamline refinances

// ------------------------------------------------------------
// UFMIP refund percentage table (month 1–36+)
// Month 1 = 80%, decreasing by 2% each month, reaching 0% at month 36+
// ------------------------------------------------------------
const UFMIP_REFUND_TABLE: Record<number, number> = {
  1:  80, 2:  78, 3:  76, 4:  74, 5:  72,
  6:  70, 7:  68, 8:  66, 9:  64, 10: 62,
  11: 60, 12: 58, 13: 56, 14: 54, 15: 52,
  16: 50, 17: 48, 18: 46, 19: 44, 20: 42,
  21: 40, 22: 38, 23: 36, 24: 34, 25: 32,
  26: 30, 27: 28, 28: 26, 29: 24, 30: 22,
  31: 20, 32: 18, 33: 16, 34: 14, 35: 12,
};

const NEW_UFMIP_RATE = 0.0175; // 1.75%

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

export interface FHAStreamlineInputs {
  currentBalance: number;
  originalClosingDate: string; // ISO date string
  ufmipPaid: number;           // original UFMIP paid at closing
  originalBaseAmount: number;
  closingCostsRolled: number;  // additional costs rolled into new loan
  isFHAtoFHA: boolean;
  currentRate: number;         // percentage (e.g. 6.5 for 6.5%)
  newRate: number;             // percentage
  remainingTermMonths: number;
}

export interface FHAStreamlineResult {
  monthsSinceClosing: number;
  ufmipRefundPercentage: number;
  ufmipRefundAmount: number;
  newBaseAmount: number;
  newUFMIP: number;            // 1.75% of new base
  netUFMIPAfterRefund: number;
  totalNewLoanAmount: number;
  currentMonthlyPayment: number; // principal + interest only
  newMonthlyPayment: number;
  monthlySavings: number;
  inRefundWindow: boolean;
  isEligibleForRefund: boolean;
  notes: string[];
  breakdown: { label: string; amount: number }[];
}

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------

/**
 * Calculates the monthly principal-and-interest payment.
 * @param principal  Loan amount in dollars
 * @param annualRate Annual interest rate as a percentage (e.g. 6.5 for 6.5%)
 * @param termMonths Number of months in the loan term
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (principal <= 0) return 0;

  // Handle zero-rate edge case
  if (annualRate === 0) {
    return principal / termMonths;
  }

  const monthlyRate = annualRate / 100 / 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return Math.round(payment * 100) / 100;
}

/**
 * Returns the number of whole months elapsed between two dates.
 * Uses calendar months (day-of-month comparison).
 */
export function monthsBetween(startDate: Date, endDate: Date): number {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  let totalMonths = years * 12 + months;

  // If the end day is before the start day, the current month is not yet complete
  if (endDate.getDate() < startDate.getDate()) {
    totalMonths -= 1;
  }

  return Math.max(0, totalMonths);
}

/**
 * Returns the UFMIP refund percentage (0–80) for a given number of months since closing.
 * Returns 0 for month 36 and beyond.
 */
export function getUFMIPRefundPercentage(monthsSinceClosing: number): number {
  if (monthsSinceClosing < 1) return 0;
  if (monthsSinceClosing >= 36) return 0;
  return UFMIP_REFUND_TABLE[monthsSinceClosing] ?? 0;
}

// ------------------------------------------------------------
// Main calculation
// ------------------------------------------------------------

/**
 * Calculates FHA Streamline refinance figures including UFMIP refund credit,
 * new loan amount, payment comparison, and eligibility notes.
 */
export function calculateFHAStreamline(
  inputs: FHAStreamlineInputs
): FHAStreamlineResult {
  const {
    currentBalance,
    originalClosingDate,
    ufmipPaid,
    closingCostsRolled,
    isFHAtoFHA,
    currentRate,
    newRate,
    remainingTermMonths,
  } = inputs;

  const today = new Date();
  const closingDate = new Date(originalClosingDate);

  const monthsSinceClosing = monthsBetween(closingDate, today);
  const inRefundWindow = monthsSinceClosing >= 1 && monthsSinceClosing < 36;

  // UFMIP refund only applies to FHA-to-FHA streamlines within the refund window
  const isEligibleForRefund = isFHAtoFHA && inRefundWindow;

  const ufmipRefundPercentage = isEligibleForRefund
    ? getUFMIPRefundPercentage(monthsSinceClosing)
    : 0;

  const ufmipRefundAmount = isEligibleForRefund
    ? Math.round((ufmipRefundPercentage / 100) * ufmipPaid * 100) / 100
    : 0;

  // New base amount = current balance + closing costs rolled in
  const newBaseAmount = currentBalance + closingCostsRolled;

  // New UFMIP = 1.75% of new base loan amount
  const newUFMIP = Math.round(newBaseAmount * NEW_UFMIP_RATE * 100) / 100;

  // Net UFMIP after applying the refund credit
  const netUFMIPAfterRefund = Math.max(0, newUFMIP - ufmipRefundAmount);

  // Total new loan amount = new base + net UFMIP (refund is applied as a credit, not cash)
  const totalNewLoanAmount = Math.round((newBaseAmount + netUFMIPAfterRefund) * 100) / 100;

  // Monthly payment comparison (P&I only)
  const currentMonthlyPayment = calculateMonthlyPayment(
    currentBalance,
    currentRate,
    remainingTermMonths
  );

  const newMonthlyPayment = calculateMonthlyPayment(
    totalNewLoanAmount,
    newRate,
    remainingTermMonths
  );

  const monthlySavings =
    Math.round((currentMonthlyPayment - newMonthlyPayment) * 100) / 100;

  // Notes
  const notes: string[] = [];

  if (!isFHAtoFHA) {
    notes.push(
      "UFMIP refund is only available for FHA-to-FHA streamline refinances."
    );
  }

  if (!inRefundWindow) {
    if (monthsSinceClosing < 1) {
      notes.push(
        "UFMIP refund window has not yet started. The loan must be at least 1 month old."
      );
    } else {
      notes.push(
        `The original loan is ${monthsSinceClosing} months old — outside the 36-month UFMIP refund window. No refund credit applies.`
      );
    }
  } else if (isEligibleForRefund) {
    notes.push(
      `UFMIP refund credit of ${ufmipRefundPercentage}% ($${ufmipRefundAmount.toFixed(2)}) will be applied toward the new UFMIP.`
    );
  }

  if (monthlySavings > 0) {
    notes.push(
      `Refinance reduces the monthly P&I payment by $${monthlySavings.toFixed(2)}.`
    );
  } else if (monthlySavings < 0) {
    notes.push(
      `Warning: Refinance increases the monthly P&I payment by $${Math.abs(monthlySavings).toFixed(2)}.`
    );
  } else {
    notes.push("The monthly P&I payment is unchanged after refinancing.");
  }

  if (closingCostsRolled > 0) {
    notes.push(
      `$${closingCostsRolled.toFixed(2)} in closing costs are rolled into the new loan balance.`
    );
  }

  // Breakdown
  const breakdown: FHAStreamlineResult["breakdown"] = [
    { label: "Current Balance",           amount: currentBalance },
    { label: "Closing Costs Rolled In",   amount: closingCostsRolled },
    { label: "New Base Loan Amount",       amount: newBaseAmount },
    { label: "New UFMIP (1.75%)",         amount: newUFMIP },
    { label: "UFMIP Refund Credit",       amount: -ufmipRefundAmount },
    { label: "Net UFMIP After Refund",    amount: netUFMIPAfterRefund },
    { label: "Total New Loan Amount",     amount: totalNewLoanAmount },
    { label: "Current Monthly P&I",       amount: currentMonthlyPayment },
    { label: "New Monthly P&I",           amount: newMonthlyPayment },
    { label: "Monthly Savings",           amount: monthlySavings },
  ];

  return {
    monthsSinceClosing,
    ufmipRefundPercentage,
    ufmipRefundAmount,
    newBaseAmount,
    newUFMIP,
    netUFMIPAfterRefund,
    totalNewLoanAmount,
    currentMonthlyPayment,
    newMonthlyPayment,
    monthlySavings,
    inRefundWindow,
    isEligibleForRefund,
    notes,
    breakdown,
  };
}
