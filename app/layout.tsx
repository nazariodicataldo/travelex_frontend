import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Providers from "./providers";
import CreatePost from "@/components/CreatePost";
import { Toaster } from "@/components/ui/sonner";
import { SessionExpiredDialog } from "@/components/SessionExpiredDialog";

const notoSerifHeading = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelEx | Condividi le tue esperienze di viaggio",
  description:
    "Esplora, salva e condividi esperienze di viaggio insieme ad altri migliaia di utenti",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        dmSans.variable,
        notoSerifHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background">
        <Header />{" "}
        <main className="my-12 container mx-auto px-4">
          <Providers>{children}</Providers>
          <CreatePost />
          <SessionExpiredDialog />
        </main>
        <Toaster />
      </body>
    </html>
  );
}
