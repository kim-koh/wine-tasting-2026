import type { Metadata, Viewport } from "next";
import { Cinzel, Monsieur_La_Doulaise, Playfair_Display, Tangerine } from "next/font/google";
import { PartyProvider } from "@/hooks/EventStateProvider";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const tangerine = Tangerine({
  variable: "--font-tangerine",
  subsets: ["latin"],
  weight: "400",
})

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  variable: "--font-monsieur-la-doulaise",
  subsets: ["latin"],
  weight: "400"
}); 

export const metadata: Metadata = {
  title: "Wine Tasting 2026",
  description: "Join us for our 5th annual wine tasting event",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // "#ff8dafae"
  return (
    <html lang="en" 
      className={`${cinzel.variable} ${playfairDisplay.variable} ${tangerine.variable} ${monsieurLaDoulaise.variable}`}
    >
    <title>Midsommar Night's Dream: Wine Tasting 2026</title>
    <meta name="theme-color" content="#F7ABC3" />
      <body>
        <PartyProvider>
          {children}
        </PartyProvider>
      </body>
    </html>
  );
}
