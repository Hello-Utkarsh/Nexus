import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHAKRAVYUH // AI-Powered Criminal Network Intelligence",
  description: "Turn fragmented intelligence into explainable networks of people, communications, money and locations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#F8FAFC] text-slate-900 antialiased selection:bg-slate-200 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
