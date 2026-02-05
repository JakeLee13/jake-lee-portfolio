import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jacob Lee",
  description: "Software Engineer and Data Scientist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black text-black dark:text-white">
        {children}
      </body>
    </html>
  );
}
