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
  X,
  Package
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<"ADMIN" | "STUDENT">("ADMIN");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "📦 Gestor Catálogo", href: "/admin/products", icon: Package, roleRequired: "ADMIN" },
    { label: "📚 Course Builder", href: "/admin/courses/builder", icon: Wrench, roleRequired: "ADMIN" },
    { label: "📊 Métricas Estudiantes", href: "/admin/students", icon: BookOpen, roleRequired: "ADMIN" },
    { label: "📈 Dashboard KPI", href: "/admin/dashboard", icon: LayoutDashboard, roleRequired: "ADMIN" },
    { label: "🎵 Tienda & Assets", href: "/store", icon: ShoppingBag },
    { label: "Mis Descargas", href: "/account/downloads", icon: Download },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/admin/products" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-teal-500/50 flex items-center justify-center shadow-glow group-hover:border-teal-400 transition-colors shrink-0">
              <Sparkles className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider text-zinc-100 font-mono">
                  SYNTHESIS<span className="text-teal-400">.STUDIO</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
                  ADMIN
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              if (item.roleRequired && userRole !== item.roleRequired) return null;
              const isActive = pathname === item.href || (item.href !== "/store" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 h-10 px-3.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-sm"
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
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setUserRole(userRole === "ADMIN" ? "STUDENT" : "ADMIN")}
              className="flex items-center gap-1.5 h-10 px-3.5 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-colors"
              title="Haz clic para alternar la vista de simulación de rol"
            >
              {userRole === "ADMIN" ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-teal-400" />
                  <span>Modo: <strong className="text-teal-400 font-semibold">LMS ADMIN</strong></span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-brand-primary" />
                  <span>Modo: <strong className="text-brand-primary font-semibold">ESTUDIANTE</strong></span>
                </>
              )}
            </button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-brand-primary p-[1px]">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-sm font-bold text-teal-400">
                AP
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-zinc-100 flex items-center justify-center h-11 w-11 rounded-lg hover:bg-zinc-900 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-2 pb-6 space-y-2">

          <div className="mb-4 pb-4 border-b border-zinc-900 flex justify-between items-center sm:hidden">
             <button
              onClick={() => setUserRole(userRole === "ADMIN" ? "STUDENT" : "ADMIN")}
              className="flex items-center justify-center w-full gap-2 h-11 px-4 rounded-xl text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-300"
            >
              {userRole === "ADMIN" ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-teal-400" />
                  <span>Modo: <strong className="text-teal-400 font-semibold">ADMIN</strong></span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-brand-primary" />
                  <span>Modo: <strong className="text-brand-primary font-semibold">ESTUDIANTE</strong></span>
                </>
              )}
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.roleRequired && userRole !== item.roleRequired) return null;
            const isActive = pathname === item.href || (item.href !== "/store" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 h-12 px-4 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-zinc-900 text-teal-400 border border-zinc-800" : "text-zinc-300 hover:bg-zinc-900/50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-teal-400" : "text-zinc-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
