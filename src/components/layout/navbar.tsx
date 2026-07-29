"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  BookOpen, 
  ShoppingBag, 
  LayoutDashboard, 
  Wrench, 
  Download, 
  ShieldAlert, 
  UserCheck, 
  Menu, 
  X 
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<"ADMIN" | "STUDENT">("ADMIN");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Tienda Musical", href: "/store", icon: ShoppingBag },
    { label: "Cursos LMS", href: "/courses", icon: BookOpen },
    { label: "Panel de Control", href: "/admin/dashboard", icon: LayoutDashboard, roleRequired: "ADMIN" },
    { label: "Creador de Cursos", href: "/admin/courses/builder", icon: Wrench, roleRequired: "ADMIN" },
    { label: "Mis Descargas", href: "/account/downloads", icon: Download },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090a0f]/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/store" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-teal-500/40 flex items-center justify-center shadow-glow group-hover:border-teal-400 transition-colors">
              <Sparkles className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-zinc-100 font-mono">
                SYNTHESIS<span className="text-teal-400">.AUDIO</span>
              </span>
              <span className="block text-[10px] text-zinc-400 uppercase tracking-widest -mt-1 font-sans">
                Plataforma LMS y Tienda Musical
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.roleRequired && userRole !== item.roleRequired) return null;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-zinc-800/90 text-teal-300 border border-teal-500/30 shadow-glow"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Role Toggle Simulator */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setUserRole(userRole === "ADMIN" ? "STUDENT" : "ADMIN")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-teal-500/50 transition-colors"
              title="Haz clic para alternar la vista de simulación de rol"
            >
              {userRole === "ADMIN" ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
                  <span>Modo: <strong className="text-teal-300">ADMIN</strong></span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Modo: <strong className="text-purple-300">ESTUDIANTE</strong></span>
                </>
              )}
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-purple-600 p-[1px]">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-xs font-bold text-teal-300">
                AP
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-zinc-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0f17] border-b border-zinc-800 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <Icon className="w-4 h-4 text-teal-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
