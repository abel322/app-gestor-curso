import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "@/context/audio-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlobalAudioPlayer } from "@/components/audio/global-audio-player";

export const metadata: Metadata = {
  title: "SYNTHESIS | LMS Course Management & Music E-Commerce",
  description: "All-in-One LMS Dashboard & Music E-Commerce Storefront for producers, sound designers, and music educators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0f] text-zinc-100 min-h-screen flex flex-col antialiased">
        <AudioProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <GlobalAudioPlayer />
          <Footer />
        </AudioProvider>
      </body>
    </html>
  );
}
