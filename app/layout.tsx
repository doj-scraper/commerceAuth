// app/layout.tsx
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "CellTech B2B ERP",
  description: "Wholesale Cellphone Parts Distribution Platform",
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={
        {
          '--font-sora': 'system-ui, sans-serif',
          '--font-inter': 'system-ui, sans-serif',
          '--font-ibm-plex-mono': 'ui-monospace, SFMono-Regular, monospace',
        } as CSSProperties
      }
    >
      <body className="bg-ct-bg text-ct-text font-inter antialiased flex flex-col min-h-screen">
        <ClerkProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
