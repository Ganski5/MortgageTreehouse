import { StyleSheet } from "@react-pdf/renderer";

export const C = {
  emerald:   "#059669",
  emeraldLt: "#d1fae5",
  zinc900:   "#18181b",
  zinc700:   "#3f3f46",
  zinc500:   "#71717a",
  zinc400:   "#a1a1aa",
  zinc200:   "#e4e4e7",
  zinc100:   "#f4f4f5",
  zinc50:    "#fafafa",
  red:       "#ef4444",
  redLt:     "#fee2e2",
  amber:     "#f59e0b",
  white:     "#ffffff",
};

export const base = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    backgroundColor: C.white,
    fontSize: 10,
    color: C.zinc700,
  },

  // ── Header ──────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  brandName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.emerald,
    letterSpacing: 0.3,
  },
  calcTitle: {
    fontSize: 10,
    color: C.zinc500,
    marginTop: 3,
  },
  dateText: {
    fontSize: 9,
    color: C.zinc400,
    textAlign: "right",
  },
  rule: {
    height: 2,
    backgroundColor: C.emerald,
    marginBottom: 24,
    borderRadius: 1,
  },

  // ── Sections ─────────────────────────────────────────────────────
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.zinc400,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.zinc200,
  },

  // ── Table ────────────────────────────────────────────────────────
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.zinc100,
    paddingVertical: 6,
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: C.zinc50,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: C.zinc100,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  thText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.zinc500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tdText: {
    fontSize: 10,
    color: C.zinc700,
  },
  tdMuted: {
    fontSize: 10,
    color: C.zinc500,
  },
  tdBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.zinc900,
  },
  tdEmerald: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.emerald,
  },
  tdRed: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.red,
  },

  // ── Summary banner ───────────────────────────────────────────────
  passBanner: {
    backgroundColor: C.emeraldLt,
    borderWidth: 1,
    borderColor: C.emerald,
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  failBanner: {
    backgroundColor: C.redLt,
    borderWidth: 1,
    borderColor: C.red,
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bannerLabel: {
    fontSize: 8,
    color: C.zinc500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  bannerValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },
  badgePass: {
    backgroundColor: C.emerald,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeFail: {
    backgroundColor: C.red,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    color: C.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },

  // ── Footer ───────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: C.zinc200,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerBrand: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.emerald,
  },
  footerDisclaimer: {
    fontSize: 7,
    color: C.zinc400,
    textAlign: "center",
    flex: 1,
    marginHorizontal: 12,
  },
  footerBroker: {
    fontSize: 8,
    color: C.zinc500,
    textAlign: "right",
  },
});
