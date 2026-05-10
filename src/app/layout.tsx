import type { Metadata } from "next";

import { env } from "@/lib/env";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  title: {
    default: "NarraTrack | ACX Audition Tracker & Royalty-Share Calculator",
    template: "%s | NarraTrack",
  },
  description:
    "Track ACX auditions, bookings, PFH rates, royalty-share ROI, invoices, and payments in one narrator-first workspace.",
  openGraph: {
    title: "NarraTrack",
    description:
      "The audition-to-invoice business tracker built for freelance voice actors and audiobook narrators.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
