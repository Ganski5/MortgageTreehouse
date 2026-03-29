import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Mortgage Treehouse — Tools & Education for Homebuyers and Brokers",
    template: "%s | Mortgage Treehouse",
  },
  description:
    "Mortgage Treehouse gives homebuyers plain-English mortgage education and gives brokers fast, reliable calculation tools. No jargon. No clutter.",
  keywords: ["mortgage calculator", "VA residual income", "FHA streamline", "mortgage education", "home buying", "mortgage broker tools"],
  openGraph: {
    siteName: "Mortgage Treehouse",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f9f8f6] text-[#1e2533] antialiased" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
