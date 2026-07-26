import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fonte de destaque do brandbook (títulos/logotipo), fornecida pela usuária.
const codecCold = localFont({
  src: "../fonts/CodecColdLogo-Regular.otf",
  variable: "--font-codec-cold",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal de Solicitações Formô Brasil",
  description:
    "Solicite artes, acompanhe a produção e receba a entrega final da sua turma de formatura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${codecCold.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
