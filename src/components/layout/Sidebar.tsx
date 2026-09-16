"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  FolderGit2,
  BookOpen,
  Users,
  BarChart3,
  ShoppingBag,
  Download,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roleRequired?: "ADMIN" | "STUDENT";
}

export function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<"ADMIN" | "STUDENT">("ADMIN");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: "Gestor Catálogo", href: "/admin/products", icon: FolderGit2, roleRequired: "ADMIN" },
    { label: "Course Builder", href: "/admin/courses/builder", icon: BookOpen, roleRequired: "ADMIN" },
    { label: "Métricas Estudiantes", href: "/admin/students", icon: Users, roleRequired: "ADMIN" },
    { label: "Dashboard KPI", href: "/admin/dashboard", icon: BarChart3, roleRequired: "ADMIN" },
    { label: "Tienda & Assets", href: "/store", icon: ShoppingBag },
    { label: "Mis Descargas", href: "/account/downloads", icon: Download },
  ];

  const renderNavLinks = (onItemClick?: () => void) => (
    <div className="space-y-1">
      <div className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        Plataforma
      </div>
      {navItems.map((item) => {
        if (item.roleRequired && userRole !== item.roleRequired) return null;
        const isActive =
          pathname === item.href ||
          (item.href !== "/store" && item.href !== "/account/downloads" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onItemClick && onItemClick()}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
              isActive
                ? "bg-zinc-900 text-white font-medium border border-zinc-850 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? "text-indigo-400" : "text-zinc-400 group-hover:text-zinc-200"
              }`}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );

  const renderBottomProfile = () => (
    <div className="pt-4 border-t border-zinc-800/80 space-y-3">
      {/* Compact Mode Selector */}
      <button
        type="button"
        onClick={() => setUserRole(userRole === "ADMIN" ? "STUDENT" : "ADMIN")}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 text-xs transition-all text-zinc-300 group"
        title="Cambiar vista de rol"
      >
        <span className="text-zinc-400 group-hover:text-zinc-300">Modo:</span>
        <span
          className={`font-semibold inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] ${
            userRole === "ADMIN"
              ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
          }`}
        >
          {userRole === "ADMIN" ? (
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          ) : (
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>{userRole}</span>
        </span>
      </button>

      {/* Discrete AP User Profile */}
      <div className="flex items-center gap-3 px-1.5 py-1">
        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-200 shrink-0">
          AP
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-semibold text-zinc-200 truncate leading-tight">Admin Workspace</span>
          <span className="text-[11px] text-zinc-500 truncate leading-tight mt-0.5">admin@synthesis.studio</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Minimal Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between z-40">
        <Link href="/admin/courses/builder" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-100 font-mono">
            SYNTHESIS<span className="text-indigo-400">.STUDIO</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-900 transition-colors"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[85vw] h-full bg-zinc-950 border-r border-zinc-800/80 p-4 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              {/* Header with Close */}
              <div className="flex items-center justify-between px-2">
                <Link
                  href="/admin/courses/builder"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <span className="font-semibold text-sm tracking-tight text-zinc-100 font-mono">
                    SYNTHESIS<span className="text-indigo-400">.STUDIO</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {renderNavLinks(() => setMobileMenuOpen(false))}
            </div>

            {renderBottomProfile()}
          </div>
        </div>
      )}

      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-800/80 p-4 flex-col justify-between z-30 select-none">
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <Link
            href="/admin/courses/builder"
            className="flex items-center gap-2.5 px-2 py-1 group transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 group-hover:border-indigo-500/50 transition-colors shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-400 group-hover:scale-105 transition-transform" />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-100 font-mono">
              SYNTHESIS<span className="text-indigo-400">.STUDIO</span>
            </span>
          </Link>

          {/* Navigation Links */}
          {renderNavLinks()}
        </div>

        {/* Profile & Mode Toggle Footer */}
        {renderBottomProfile()}
      </aside>
    </>
  );
}
