import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Human Guess - Daily Intuition Game",
  description: "Test your intuition about human behavior. One question per day. How well do you know people?",
  keywords: ["game", "daily", "quiz", "human behavior", "intuition", "wordle"],
  openGraph: {
    title: "Human Guess",
    description: "Test your intuition about human behavior. One question per day.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

