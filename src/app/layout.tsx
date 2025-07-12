import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOLD ELEGANCE - Event Decoration Services",
  description: "GOLD ELEGANCE company decorates all types of events with premium quality and elegant design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-primary antialiased">
        {children}
      </body>
    </html>
  );
}
