import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { base, C } from "./pdfStyles";

interface ProductResult {
  loanAmtFinanced: number;
  monthlyPI:       number;
  monthlyMI:       number;
  totalMonthly:    number;
  upfrontMI:       number;
  pointsCost:      number;
  lenderFees:      number;
  cashToClose:     number;
  totalInterest:   number;
  totalMIStay:     number;
  totalCostStay:   number;
}

export interface LoanComparisonPDFProps {
  txType:         string;
  refiSub:        string;
  purchasePrice:  string;
  loanAmount:     string;
  ltv:            number;
  downPct:        number;
  creditScore:    string;
  stayYears:      string;
  vaFirstUse:     boolean;
  vaFeeExempt:    boolean;
  convResult:     ProductResult | null;
  fhaResult:      ProductResult | null;
  vaResult:       ProductResult | null;
  convRate:       string;
  fhaMIPRate:     number;
  vaFeeRate:      number;
  sharedFeeTotal: number;
  sellerConc:     number;
  costWinner:     "conv" | "fha" | "va" | null;
  cashWinner:     "conv" | "fha" | "va" | null;
  pmtWinner:      "conv" | "fha" | "va" | null;
  logoSrc?:       string;
  brokerName?:    string;
  brokerPhone?:   string;
  brokerEmail?:   string;
}

function curr(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function currCents(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const PRODUCT_COLORS = {
  conv: "#2563eb",
  fha:  "#d97706",
  va:   "#059669",
};

const PRODUCT_LABELS = { conv: "Conventional", fha: "FHA", va: "VA" };

type PK = "conv" | "fha" | "va";

const TABLE_ROWS: { label: string; field: keyof ProductResult; cents?: boolean }[] = [
  { label: "Monthly P&I",               field: "monthlyPI",      cents: true  },
  { label: "Monthly MI / PMI",          field: "monthlyMI",      cents: true  },
  { label: "Total Monthly Payment",     field: "totalMonthly",   cents: true  },
  { label: "Upfront MI / Funding Fee",  field: "upfrontMI"                   },
  { label: "Points / Credits",          field: "pointsCost"                  },
  { label: "Lender Fees",              field: "lenderFees"                  },
  { label: "Cash to Close (excl. DP)", field: "cashToClose"                 },
  { label: "Total Loan Interest",       field: "totalInterest"               },
  { label: "Total MI (stay period)",    field: "totalMIStay"                 },
  { label: "Total Cost (stay period)",  field: "totalCostStay"               },
];

export function LoanComparisonPDF({
  txType, refiSub, purchasePrice, loanAmount, ltv, downPct,
  creditScore, stayYears, vaFirstUse, vaFeeExempt,
  convResult, fhaResult, vaResult,
  convRate, fhaMIPRate, vaFeeRate,
  sharedFeeTotal, sellerConc,
  costWinner, cashWinner, pmtWinner,
  logoSrc, brokerName, brokerPhone, brokerEmail,
}: LoanComparisonPDFProps) {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const results: Record<PK, ProductResult | null> = { conv: convResult, fha: fhaResult, va: vaResult };
  const activePKs = (["conv", "fha", "va"] as PK[]).filter(k => results[k] !== null);

  const colW = activePKs.length === 3 ? "27%" : activePKs.length === 2 ? "35%" : "50%";
  const labelW = activePKs.length === 3 ? "19%" : "30%";

  const txLabel = txType === "purchase" ? "Purchase"
    : refiSub === "irrrl" ? "Refinance — IRRRL (VA)"
    : refiSub === "cash-out" ? "Refinance — Cash-Out"
    : "Refinance — Rate/Term";

  return (
    <Document>
      <Page size="LETTER" style={base.page}>

        {/* Header */}
        <View style={base.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {logoSrc ? <Image src={logoSrc} style={{ width: 28, height: 28 }} /> : null}
            <View>
              <Text style={base.brandName}>Mortgage Treehouse</Text>
              <Text style={base.calcTitle}>Loan Product Comparison</Text>
            </View>
          </View>
          <Text style={base.dateText}>Generated {today}</Text>
        </View>
        <View style={base.rule} />

        {/* Scenario Overview */}
        <View style={base.section}>
          <Text style={base.sectionTitle}>Scenario Overview</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            {[
              { label: "Transaction",   value: txLabel },
              { label: "Loan Amount",   value: loanAmount ? `$${Number(loanAmount.replace(/[^0-9.]/g,"")).toLocaleString()}` : "—" },
              { label: "Purchase Price",value: purchasePrice ? `$${Number(purchasePrice.replace(/[^0-9.]/g,"")).toLocaleString()}` : "—" },
              { label: "LTV",           value: ltv > 0 ? `${ltv.toFixed(1)}%` : "—" },
              { label: "Down Payment",  value: downPct > 0 ? `${downPct.toFixed(1)}%` : "—" },
              { label: "Credit Score",  value: creditScore },
              { label: "Intended Stay", value: `${stayYears} years` },
              { label: "VA Use",        value: vaFeeExempt ? "Exempt" : vaFirstUse ? "First Use" : "Subsequent" },
            ].map(({ label, value }) => (
              <View key={label} style={{ minWidth: "23%", marginBottom: 4 }}>
                <Text style={{ fontSize: 8, color: C.zinc400, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{label}</Text>
                <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: C.zinc900 }}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Product column headers */}
        <View style={base.section}>
          <Text style={base.sectionTitle}>Side-by-Side Comparison</Text>

          {/* Column headers */}
          <View style={[base.tableHeader, { paddingHorizontal: 4 }]}>
            <Text style={[base.thText, { width: labelW }]}>Category</Text>
            {activePKs.map(k => (
              <Text key={k} style={[base.thText, { width: colW, textAlign: "center", color: PRODUCT_COLORS[k] }]}>
                {PRODUCT_LABELS[k]}
              </Text>
            ))}
          </View>

          {/* Rows */}
          {TABLE_ROWS.map((row, ri) => {
            const vals = activePKs.map(k => (results[k]![row.field] as number));
            const minVal = Math.min(...vals);
            return (
              <View key={row.field} style={[base.tableRow, ri % 2 === 1 ? base.tableRowAlt : {}]}>
                <Text style={[base.tdMuted, { width: labelW, fontSize: 9 }]}>{row.label}</Text>
                {activePKs.map((k, ci) => {
                  const val = vals[ci];
                  const isWinner = activePKs.length > 1 && Math.abs(val - minVal) < 0.01;
                  const isCredit = row.field === "pointsCost" && val < 0;
                  return (
                    <Text key={k} style={[
                      { width: colW, textAlign: "center", fontSize: 9 },
                      isWinner
                        ? { fontFamily: "Helvetica-Bold", color: C.emerald }
                        : isCredit
                        ? { color: C.emerald }
                        : { color: C.zinc700 },
                    ]}>
                      {isWinner ? "✓ " : ""}
                      {isCredit
                        ? `${curr(Math.abs(val))} cr.`
                        : row.cents ? currCents(val) : curr(val)}
                    </Text>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Winner Summary */}
        {(costWinner || cashWinner || pmtWinner) && (
          <View style={[base.passBanner, { marginBottom: 16 }]}>
            <View style={{ flex: 1 }}>
              <Text style={base.bannerLabel}>Winners at a Glance</Text>
              <View style={{ marginTop: 6, gap: 4 }}>
                {pmtWinner  && <Text style={{ fontSize: 9, color: C.zinc700 }}>Lowest Monthly Payment:  <Text style={{ fontFamily: "Helvetica-Bold", color: C.emerald }}>{PRODUCT_LABELS[pmtWinner]}</Text></Text>}
                {cashWinner && <Text style={{ fontSize: 9, color: C.zinc700 }}>Lowest Cash to Close:    <Text style={{ fontFamily: "Helvetica-Bold", color: C.emerald }}>{PRODUCT_LABELS[cashWinner]}</Text></Text>}
                {costWinner && <Text style={{ fontSize: 9, color: C.zinc700 }}>Lowest Total Cost ({stayYears}yr): <Text style={{ fontFamily: "Helvetica-Bold", color: C.emerald }}>{PRODUCT_LABELS[costWinner]}</Text></Text>}
              </View>
            </View>
            {costWinner && (
              <View style={base.badgePass}>
                <Text style={base.badgeText}>Best Overall: {PRODUCT_LABELS[costWinner]}</Text>
              </View>
            )}
          </View>
        )}

        {/* MI Notes */}
        <View style={[base.section, { marginBottom: 10 }]}>
          <Text style={base.sectionTitle}>Mortgage Insurance Notes</Text>
          <Text style={{ fontSize: 8, color: C.zinc500, marginBottom: 4 }}>
            FHA Annual MIP Rate: {(fhaMIPRate * 100).toFixed(2)}% of loan balance (auto-calculated based on LTV and loan amount).
            MIP duration: {ltv > 90 ? "Life of loan (LTV > 90%)" : "11 years (LTV ≤ 90%)"}. Source: HUD ML 2023-04.
          </Text>
          {vaFeeExempt
            ? <Text style={{ fontSize: 8, color: C.zinc500 }}>VA Funding Fee: Exempt (disability or Purple Heart).</Text>
            : vaFeeRate > 0
            ? <Text style={{ fontSize: 8, color: C.zinc500 }}>VA Funding Fee Rate: {(vaFeeRate * 100).toFixed(2)}% ({vaFirstUse ? "first use" : "subsequent use"}, {downPct < 5 ? "0% down" : downPct < 10 ? "5–9.99% down" : "10%+ down"}).</Text>
            : null
          }
        </View>

        {/* Footer */}
        <View style={base.footer} fixed>
          <Text style={base.footerBrand}>Mortgage Treehouse</Text>
          <Text style={base.footerDisclaimer}>
            For educational use only. Results are estimates and do not include taxes, insurance, or escrow. Always verify with current rate sheets and guidelines.
          </Text>
          <Text style={base.footerBroker}>
            {brokerName
              ? `${brokerName}${brokerPhone ? `  |  ${brokerPhone}` : ""}${brokerEmail ? `  |  ${brokerEmail}` : ""}`
              : "mortgagetreehouse.com"}
          </Text>
        </View>

      </Page>
    </Document>
  );
}
