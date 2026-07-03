import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { base, C } from "./pdfStyles";

function curr(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function currCents(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtMonths(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return y === 0 ? `${m}mo` : m === 0 ? `${y}yr` : `${y}yr ${m}mo`;
}

export interface PDFInputs {
  label: string;
  loanAmount: string;
  rate: string;
  termYears: string;
  extraPayment: string;
}
export interface PDFYearSummary {
  year: number;
  principal: number;
  interest: number;
  endBalance: number;
  cumInterest: number;
}
export interface PDFResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  payoffMonths: number;
  years: PDFYearSummary[];
}

export interface AmortizationPDFProps {
  inputsA: PDFInputs;
  resultA: PDFResult | null;
  inputsB: PDFInputs;
  resultB: PDFResult | null;
  logoSrc?: string;
  // Branding slot — future Pro tier
  brokerName?: string;
  brokerPhone?: string;
  brokerEmail?: string;
}

const COL = {
  year: "8%",
  principalA: "13%",
  interestA:  "13%",
  balanceA:   "15%",
  principalB: "13%",
  interestB:  "13%",
  balanceB:   "15%",
  saved:      "10%",
};

function ScenarioInputBlock({ inputs, result, color }: { inputs: PDFInputs; result: PDFResult; color: string }) {
  const label = inputs.label || "";
  const rows = [
    { k: "Loan Amount",    v: `$${Number(inputs.loanAmount.replace(/[^0-9.]/g, "")).toLocaleString()}` },
    { k: "Interest Rate",  v: `${inputs.rate}%` },
    { k: "Loan Term",      v: `${inputs.termYears} years` },
    { k: "Extra/Month",    v: inputs.extraPayment && inputs.extraPayment !== "0" ? currCents(parseFloat(inputs.extraPayment)) : "—" },
  ];
  const stats = [
    { k: "Monthly Payment", v: currCents(result.monthlyPayment) },
    { k: "Total Interest",  v: curr(result.totalInterest) },
    { k: "Total Paid",      v: curr(result.totalPaid) },
    { k: "Payoff",          v: fmtMonths(result.payoffMonths) },
  ];
  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 6, backgroundColor: C.zinc50, borderWidth: 1, borderColor: C.zinc200 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 6 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: C.zinc900 }}>{label}</Text>
      </View>
      {rows.map(({ k, v }) => (
        <View key={k} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
          <Text style={{ fontSize: 9, color: C.zinc500 }}>{k}</Text>
          <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: C.zinc700 }}>{v}</Text>
        </View>
      ))}
      <View style={{ borderTopWidth: 1, borderTopColor: C.zinc200, marginTop: 6, paddingTop: 6 }}>
        {stats.map(({ k, v }) => (
          <View key={k} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
            <Text style={{ fontSize: 9, color: C.zinc500 }}>{k}</Text>
            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color }}>{v}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function AmortizationPDF({
  inputsA, resultA, inputsB, resultB, logoSrc, brokerName, brokerPhone, brokerEmail,
}: AmortizationPDFProps) {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const labelA = inputsA.label || "Scenario A";
  const labelB = inputsB.label || "Scenario B";
  const hasBoth = !!resultA && !!resultB;
  const interestSaved = hasBoth ? Math.abs(resultA!.totalInterest - resultB!.totalInterest) : 0;
  const better = hasBoth ? (resultA!.totalInterest > resultB!.totalInterest ? labelB : labelA) : "";
  const maxYears = Math.max(resultA?.years.length ?? 0, resultB?.years.length ?? 0);

  return (
    <Document>
      <Page size="LETTER" style={base.page}>

        {/* Header */}
        <View style={base.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {logoSrc ? (
              <Image src={logoSrc} style={{ width: 28, height: 28 }} />
            ) : null}
            <View>
              <Text style={base.brandName}>Mortgage Treehouse</Text>
              <Text style={base.calcTitle}>Loan Amortization Comparison</Text>
            </View>
          </View>
          <Text style={base.dateText}>Generated {today}</Text>
        </View>
        <View style={base.rule} />

        {/* Scenario input summary */}
        <View style={base.section}>
          <Text style={base.sectionTitle}>Scenario Overview</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {resultA && (
              <ScenarioInputBlock inputs={{ ...inputsA, label: labelA }} result={resultA} color={C.emerald} />
            )}
            {resultB && (
              <ScenarioInputBlock inputs={{ ...inputsB, label: labelB }} result={resultB} color="#0ea5e9" />
            )}
          </View>
        </View>

        {/* Savings headline */}
        {hasBoth && interestSaved > 0 && (
          <View style={[base.passBanner, { marginBottom: 16 }]}>
            <View>
              <Text style={base.bannerLabel}>Interest Savings</Text>
              <Text style={[base.bannerValue, { color: C.emerald, fontSize: 22 }]}>{curr(interestSaved)}</Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 16 }}>
              <Text style={{ fontSize: 10, color: C.zinc700 }}>
                {better} saves {curr(interestSaved)} in total interest
                {Math.abs(resultA!.payoffMonths - resultB!.payoffMonths) > 0
                  ? ` and pays off ${fmtMonths(Math.abs(resultA!.payoffMonths - resultB!.payoffMonths))} sooner.`
                  : "."}
              </Text>
            </View>
          </View>
        )}

        {/* Year-by-year table */}
        <View style={base.section}>
          <Text style={base.sectionTitle}>Year-by-Year Breakdown</Text>

          {/* Header */}
          <View style={[base.tableHeader, { paddingHorizontal: 4 }]}>
            <Text style={[base.thText, { width: COL.year }]}>Yr</Text>
            {resultA && <>
              <Text style={[base.thText, { width: COL.principalA, textAlign: "right", color: C.emerald }]}>A Princ.</Text>
              <Text style={[base.thText, { width: COL.interestA,  textAlign: "right", color: C.emerald }]}>A Int.</Text>
              <Text style={[base.thText, { width: COL.balanceA,   textAlign: "right", color: C.emerald }]}>A Bal.</Text>
            </>}
            {resultB && <>
              <Text style={[base.thText, { width: COL.principalB, textAlign: "right", color: "#0ea5e9" }]}>B Princ.</Text>
              <Text style={[base.thText, { width: COL.interestB,  textAlign: "right", color: "#0ea5e9" }]}>B Int.</Text>
              <Text style={[base.thText, { width: COL.balanceB,   textAlign: "right", color: "#0ea5e9" }]}>B Bal.</Text>
            </>}
            {hasBoth && <Text style={[base.thText, { width: COL.saved, textAlign: "right" }]}>Saved</Text>}
          </View>

          {/* Rows */}
          {Array.from({ length: maxYears }, (_, i) => {
            const ya = resultA?.years[i];
            const yb = resultB?.years[i];
            const cumSaved = hasBoth
              ? (ya?.cumInterest ?? resultA!.totalInterest) - (yb?.cumInterest ?? resultB!.totalInterest)
              : 0;
            return (
              <View key={i} style={[base.tableRow, i % 2 === 1 ? base.tableRowAlt : {}]}>
                <Text style={[base.tdMuted, { width: COL.year }]}>{i + 1}</Text>
                {resultA && <>
                  <Text style={[base.tdText, { width: COL.principalA, textAlign: "right" }]}>
                    {ya ? curr(ya.principal) : "—"}
                  </Text>
                  <Text style={[base.tdMuted, { width: COL.interestA, textAlign: "right" }]}>
                    {ya ? curr(ya.interest) : "paid off"}
                  </Text>
                  <Text style={[base.tdText, { width: COL.balanceA, textAlign: "right" }]}>
                    {ya ? curr(ya.endBalance) : "—"}
                  </Text>
                </>}
                {resultB && <>
                  <Text style={[base.tdText, { width: COL.principalB, textAlign: "right" }]}>
                    {yb ? curr(yb.principal) : "—"}
                  </Text>
                  <Text style={[base.tdMuted, { width: COL.interestB, textAlign: "right" }]}>
                    {yb ? curr(yb.interest) : "paid off"}
                  </Text>
                  <Text style={[base.tdText, { width: COL.balanceB, textAlign: "right" }]}>
                    {yb ? curr(yb.endBalance) : "—"}
                  </Text>
                </>}
                {hasBoth && (
                  <Text style={[
                    { width: COL.saved, textAlign: "right", fontSize: 9, fontFamily: "Helvetica-Bold" },
                    cumSaved > 0 ? { color: "#0ea5e9" } : { color: C.emerald },
                  ]}>
                    {cumSaved !== 0 ? curr(Math.abs(cumSaved)) : "—"}
                  </Text>
                )}
              </View>
            );
          })}

          {/* Totals row */}
          <View style={{ flexDirection: "row", borderTopWidth: 2, borderTopColor: C.zinc200, paddingTop: 6, marginTop: 4 }}>
            <Text style={[base.tdBold, { width: COL.year }]}>Tot.</Text>
            {resultA && <>
              <Text style={[base.tdEmerald, { width: COL.principalA, textAlign: "right" }]}>{curr(resultA.totalPaid - resultA.totalInterest)}</Text>
              <Text style={[base.tdEmerald, { width: COL.interestA,  textAlign: "right" }]}>{curr(resultA.totalInterest)}</Text>
              <Text style={[base.tdMuted,   { width: COL.balanceA,   textAlign: "right" }]}>$0</Text>
            </>}
            {resultB && <>
              <Text style={[{ width: COL.principalB, textAlign: "right", fontSize: 10, fontFamily: "Helvetica-Bold", color: "#0ea5e9" }]}>{curr(resultB.totalPaid - resultB.totalInterest)}</Text>
              <Text style={[{ width: COL.interestB,  textAlign: "right", fontSize: 10, fontFamily: "Helvetica-Bold", color: "#0ea5e9" }]}>{curr(resultB.totalInterest)}</Text>
              <Text style={[base.tdMuted,   { width: COL.balanceB,   textAlign: "right" }]}>$0</Text>
            </>}
            {hasBoth && (
              <Text style={[base.tdEmerald, { width: COL.saved, textAlign: "right" }]}>
                {curr(interestSaved)}
              </Text>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={base.footer} fixed>
          <Text style={base.footerBrand}>Mortgage Treehouse</Text>
          <Text style={base.footerDisclaimer}>
            For educational use only. Results are estimates and do not include taxes, insurance, or PMI.
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
