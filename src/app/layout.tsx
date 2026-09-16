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
      <body className="bg-[#0B0F17] text-slate-100 text-sm sm:text-base min-h-screen flex flex-col antialiased">
        <AudioProvider>
          <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
            {children}
          </main>
          <GlobalAudioPlayer />
          <Footer />
        </AudioProvider>
      </body>
    </html>
  );
}
