import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHAKRAVYUH-OS // Law Enforcement Intelligence & Syndicate Graph System",
  description: "AI-Powered Criminal Syndicate Graph & Forensic Analytics Engine for Law Enforcement & Special Task Forces",
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
