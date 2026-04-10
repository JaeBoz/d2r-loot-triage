import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D2R Loot Triage",
  description: "Fast deterministic loot triage for Diablo 2 Resurrected players."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
