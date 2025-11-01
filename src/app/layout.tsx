import type { Metadata } from "next";
import { Tiro_Bangla, Roboto } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  variable: "--font-tiro-bangla",
  subsets: ["bengali", "latin"],
  display: "swap",
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bangladarpan - Admin",
  description: "Admin dashboard for Bangladarpan news portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body
        className={`${tiroBangla.variable} ${roboto.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
