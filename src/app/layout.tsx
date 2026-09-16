import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/audio-context";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalAudioPlayer } from "@/components/audio/global-audio-player";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={`${inter.className} bg-[#090D14] text-zinc-100 min-h-screen antialiased selection:bg-indigo-500/30 selection:text-white`}>
        <AudioProvider>
          {/* Radial gradient background glow */}
          <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-zinc-950 to-zinc-950" />

          <div className="flex min-h-screen">
            {/* SaaS Sidebar (Fixed on Desktop, Drawer on Mobile) */}
            <Sidebar />

            {/* Main Application Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0 pt-14 lg:pt-0">
              <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-0">
                {children}
              </main>
            </div>
          </div>

          <GlobalAudioPlayer />
        </AudioProvider>
      </body>
    </html>
  );
}
