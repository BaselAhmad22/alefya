import type { Metadata } from "next";
import {
  Instrument_Serif,
  JetBrains_Mono,
  Noto_Naskh_Arabic,
  Noto_Sans_Arabic,
  Source_Sans_3,
} from "next/font/google";
import "./globals.css";

const displayLatin = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-latin",
  display: "swap",
});

const displayArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-arabic",
  display: "swap",
});

const bodyLatin = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body-latin",
  display: "swap",
});

const bodyArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body-arabic",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AlefYa — ألف ياء",
    template: "%s · AlefYa",
  },
  description:
    "Ordered programming study paths from Alef to Ya — ASP.NET, Angular, React, Next.js, React Native, and more.",
  icons: {
    icon: [{ url: "/brand/alefya-logo.png", type: "image/png" }],
    apple: [{ url: "/brand/alefya-logo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${displayLatin.variable} ${displayArabic.variable} ${bodyLatin.variable} ${bodyArabic.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full antialiased"
        style={
          {
            "--font-display":
              "var(--font-display-latin), var(--font-display-arabic)",
            "--font-body":
              "var(--font-body-latin), var(--font-body-arabic)",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
