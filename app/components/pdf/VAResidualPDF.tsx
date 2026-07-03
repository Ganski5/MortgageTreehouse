import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { base, C } from "./pdfStyles";

const REGIONS = ["Northeast", "Midwest", "South", "West"] as const;
type Region = typeof REGIONS[number];

const THRESHOLDS = {
  above80k: {
    Northeast: [450, 755, 909, 1025, 1062],
    Midwest:   [441, 738, 889, 1003, 1039],
    South:     [441, 738, 889, 1003, 1039],
    West:      [491, 823, 990, 1117, 1158],
  },
  below80k: {
    Northeast: [390, 654, 787, 888, 921],
    Midwest:   [382, 641, 770, 868, 902],
    South:     [382, 641, 770, 868, 902],
    West:      [425, 713, 858, 967, 1004],
  },
} as const;

function getThreshold(above80k: boolean, familySize: number, region: Region): number {
  const table = above80k ? THRESHOLDS.above80k : THRESHOLDS.below80k;
  const col = table[region];
  if (familySize <= 5) return col[familySize - 1];
  if (above80k) return col[4] + (familySize - 5) * 80;
  return col[4];
}

function curr(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export interface VAResidualPDFProps {
  income: number;
  taxes: number;
  liabilities: number;
  childcare: number;
  sqFt: number;
  utilities: number;
  pitia: number;
  residual: number;
  loanAbove80k: boolean | null;
  family: number | null;
  stateName: string;
  stateAbbr: string;
  region: Region | null;
  threshold: number | null;
  passes: boolean | null;
  logoSrc?: string;
  // Branding slot — future Pro tier
  brokerName?: string;
  brokerPhone?: string;
  brokerEmail?: string;
}

const LINE_W = { label: "55%", value: "45%" };
const COL_W  = { family: "16%", region: "21%" };

export function VAResidualPDF({
  income, taxes, liabilities, childcare, sqFt, utilities, pitia, residual,
  loanAbove80k, family, stateName, stateAbbr, region, threshold, passes,
  logoSrc, brokerName, brokerPhone, brokerEmail,
}: VAResidualPDFProps) {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const unlocked = loanAbove80k !== null && family !== null && region !== null;
  const tableRows = loanAbove80k === true ? [1,2,3,4,5,6,7] : [1,2,3,4,5];

  const lineItems = [
    { label: "Qualifying Income",                    sign: "+", value: income },
    { label: "State/Federal/SS Taxes",               sign: "-", value: taxes },
    { label: "Credit Report Liabilities",            sign: "-", value: liabilities },
    { label: "Childcare / Child Support",            sign: "-", value: childcare },
    { label: `Estimated Utilities (${sqFt ? sqFt.toLocaleString() : "—"} sq ft × $0.14)`, sign: "-", value: utilities },
    { label: "Future PITIA",                         sign: "-", value: pitia },
  ];

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
              <Text style={base.calcTitle}>VA Residual Income Analysis</Text>
            </View>
          </View>
          <Text style={base.dateText}>Generated {today}</Text>
        </View>
        <View style={base.rule} />

        {/* Income & Expense Summary */}
        <View style={base.section}>
          <Text style={base.sectionTitle}>Income & Expense Summary</Text>

          {/* Column headers */}
          <View style={[base.tableHeader]}>
            <Text style={[base.thText, { width: LINE_W.label }]}>Item</Text>
            <Text style={[base.thText, { width: "10%", textAlign: "center" }]}> </Text>
            <Text style={[base.thText, { width: LINE_W.value, textAlign: "right" }]}>Monthly Amount</Text>
          </View>

          {lineItems.map((item, i) => (
            <View key={i} style={[base.tableRow, i % 2 === 1 ? base.tableRowAlt : {}]}>
              <Text style={[base.tdText, { width: LINE_W.label }]}>{item.label}</Text>
              <Text style={[
                { width: "10%", textAlign: "center", fontFamily: "Helvetica-Bold", fontSize: 11 },
                item.sign === "+" ? { color: C.emerald } : { color: C.red },
              ]}>
                {item.sign}
              </Text>
              <Text style={[base.tdText, { width: LINE_W.value, textAlign: "right" }]}>
                {item.value > 0 ? curr(item.value) : "—"}
              </Text>
            </View>
          ))}

          {/* Result row */}
          <View style={{
            flexDirection: "row",
            borderTopWidth: 2,
            borderTopColor: residual >= 0 ? C.emerald : C.red,
            paddingTop: 8,
            marginTop: 4,
            alignItems: "center",
          }}>
            <Text style={[base.tdBold, { width: LINE_W.label, fontSize: 11 }]}>
              Estimated Residual Income
            </Text>
            <Text style={{ width: "10%" }} />
            <Text style={[
              { width: LINE_W.value, textAlign: "right", fontSize: 16, fontFamily: "Helvetica-Bold" },
              residual >= 0 ? { color: C.emerald } : { color: C.red },
            ]}>
              {curr(residual)}
            </Text>
          </View>
        </View>

        {/* Pass/Fail Banner */}
        {unlocked && threshold !== null && (
          <View style={passes ? base.passBanner : base.failBanner}>
            <View>
              <Text style={base.bannerLabel}>Residual Income</Text>
              <Text style={[base.bannerValue, { color: passes ? C.emerald : C.red }]}>
                {curr(residual)}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: C.zinc400, fontSize: 10 }}>vs.</Text>
            </View>
            <View>
              <Text style={base.bannerLabel}>VA Threshold ({region})</Text>
              <Text style={[base.bannerValue, { color: C.zinc700 }]}>{curr(threshold)}</Text>
            </View>
            <View style={passes ? base.badgePass : base.badgeFail}>
              <Text style={base.badgeText}>
                {passes ? "PASS" : "FAIL"}{"  "}{passes ? "+" : ""}{curr(residual - threshold!)}
              </Text>
            </View>
          </View>
        )}

        {/* Threshold Parameters */}
        {unlocked && (
          <View style={base.section}>
            <Text style={base.sectionTitle}>Threshold Parameters</Text>
            <View style={{ flexDirection: "row", gap: 24 }}>
              {[
                { label: "State", value: stateName ? `${stateName} (${stateAbbr})` : "—" },
                { label: "VA Region", value: region ?? "—" },
                { label: "Loan Tier", value: loanAbove80k === null ? "—" : loanAbove80k ? "≥ $80,000" : "< $80,000" },
                { label: "Family Size", value: family === null ? "—" : family === 7 ? "7+" : String(family) },
                { label: "Required Residual", value: threshold !== null ? curr(threshold) : "—" },
              ].map(({ label, value }) => (
                <View key={label} style={{ flex: 1 }}>
                  <Text style={{ fontSize: 8, color: C.zinc400, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {label}
                  </Text>
                  <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: C.zinc900 }}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Threshold Table */}
        {loanAbove80k !== null && (
          <View style={base.section}>
            <Text style={base.sectionTitle}>
              VA Residual Income Table — {loanAbove80k ? "Loans ≥ $80,000" : "Loans < $80,000"}
            </Text>

            {/* Table header */}
            <View style={[base.tableHeader]}>
              <Text style={[base.thText, { width: COL_W.family }]}>Family</Text>
              {REGIONS.map((r) => (
                <Text key={r} style={[
                  base.thText,
                  { width: COL_W.region, textAlign: "center" },
                  region === r && unlocked ? { color: C.emerald } : {},
                ]}>
                  {r}
                </Text>
              ))}
            </View>

            {/* Table rows */}
            {tableRows.map((size, i) => {
              const isHighlighted = unlocked && family === size;
              return (
                <View key={size} style={[
                  base.tableRow,
                  i % 2 === 1 ? base.tableRowAlt : {},
                  isHighlighted ? { backgroundColor: C.emeraldLt } : {},
                ]}>
                  <Text style={[base.tdBold, { width: COL_W.family }]}>
                    {size === 7 ? "7+" : size}
                  </Text>
                  {REGIONS.map((r) => {
                    const val = getThreshold(loanAbove80k, size, r);
                    const highlighted = isHighlighted && region === r;
                    return (
                      <Text key={r} style={[
                        { width: COL_W.region, textAlign: "center", fontSize: 10 },
                        highlighted
                          ? { fontFamily: "Helvetica-Bold", color: C.emerald }
                          : { color: C.zinc700 },
                      ]}>
                        {curr(val)}
                      </Text>
                    );
                  })}
                </View>
              );
            })}

            <Text style={{ fontSize: 8, color: C.zinc400, marginTop: 8, fontStyle: "italic" }}>
              Source: VA Lenders Handbook, Chapter 4. Always verify against current VA guidelines.
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={base.footer} fixed>
          <Text style={base.footerBrand}>Mortgage Treehouse</Text>
          <Text style={base.footerDisclaimer}>
            For educational use only. Not a guarantee of loan approval or qualification.
          </Text>
          <Text style={base.footerBroker}>
            {brokerName ? `${brokerName}${brokerPhone ? `  |  ${brokerPhone}` : ""}${brokerEmail ? `  |  ${brokerEmail}` : ""}` : "mortgagetreehouse.com"}
          </Text>
        </View>

      </Page>
    </Document>
  );
}
