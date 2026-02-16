import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Script from "next/dist/client/script";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "InsightForge",
  description: "Forging trusted business insights from internal and external data through a conversational interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-[#050509] min-h-screen flex flex-col p-0 antialiased text-zinc-100 selection:bg-zinc-800 font-sans`}
      >
      <div className="fixed inset-0 -z-50 pointer-events-none bg-[#050509]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.03)_0%,transparent_40%)]" />
      </div>
        {children}
      </body>
    </html>
  );
}
