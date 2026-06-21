import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Solvengers | Solana's Trench Army",
  description:
    "Ansem said he's assembling a team. Now the trenches have a name: Solvengers. We're here to save SOL. The avengers on SOL. Join the trench army.",
  keywords: [
    "Solvengers",
    "Solana",
    "memecoin",
    "SOL",
    "crypto",
    "trench army",
    "Ansem",
  ],
  openGraph: {
    title: "The Solvengers | Solana's Trench Army",
    description:
      "We're a cult forming around the exact thing Solana has always been built on. Join the trenches.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Solvengers | Solana's Trench Army",
    description:
      "Ansem said he's assembling a team. Now the trenches have a name: Solvengers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-camo-pattern">
        {children}
      </body>
    </html>
  );
}
