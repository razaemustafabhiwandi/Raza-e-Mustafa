import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Amiri, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Raza-e-Mustafa Bhiwandi | Rabi-ul-Awwal Ibadat Counter",
  description:
    "Rabi-ul-Awwal ke mubarak mahine mein Durood Sharif, Kalimah aur Quran ki tilawat ka apna count jama karein.",
};

export const viewport: Viewport = {
  themeColor: "#1b1660",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="pattern-bg min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
