import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Treasures",
  description: "Your gaming collection manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-game from-background via-background-secondary to-background-tertiary">
        {children}
      </body>
    </html>
  );
}
