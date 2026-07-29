"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_COURSES, INITIAL_PURCHASES, INITIAL_USERS, INITIAL_PROGRESS } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  Headphones, 
  Sparkles, 
  Wrench, 
  Layers,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";

export default function AdminDashboardPage() {
  const [courses] = useState(INITIAL_COURSES);
  const [purchases] = useState(INITIAL_PURCHASES);
  const [users] = useState(INITIAL_USERS);
  const [progress] = useState(INITIAL_PROGRESS);

  // Calculations for KPIs
  const totalRevenue = purchases
    .filter((p) => p.status === "COMPLETED")
    .reduce((acc, p) => acc + p.amount, 0);

  const activeStudents = users.filter((u) => u.role === "STUDENT").length;
  
  const completedCount = progress.filter((p) => p.completed).length;
  const completionRate = Math.round((completedCount / (progress.length || 1)) * 100);

  const stuckStudents = progress.filter((p) => !p.completed).length;

  // Retention curve mockup data per lesson step
  const retentionCurve = [
    { lesson: "L 1.1 Intro", retention: 100 },
    { lesson: "L 1.2 FM Reese", retention: 92 },
    { lesson: "L 2.1 Gated Chords", retention: 84 },
    { lesson: "L 2.2 Sub Clean", retention: 76 },
    { lesson: "L 3.1 SSL Staging", retention: 68 },
    { lesson: "L 3.2 Tape Saturation", retention: 61 },
  ];

  // Weekly streaming metrics mockup
  const weeklyStreams = [
    { day: "Mon", streams: 420 },
    { day: "Tue", streams: 680 },
    { day: "Wed", streams: 890 },
    { day: "Thu", streams: 740 },
    { day: "Fri", streams: 1120 },
    { day: "Sat", streams: 1450 },
    { day: "Sun", streams: 1290 },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ADMIN PLATFORM CONTROL</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Course Analytics & Revenue Dashboard
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time telemetry on student progression, course completion drop-offs, and audio storefront sales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses/builder"
            className="px-4 py-2 rounded-xl bg-teal-400 text-zinc-950 font-bold text-xs hover:bg-teal-300 transition-transform active:scale-95 flex items-center gap-2 shadow-glow"
          >
            <Wrench className="w-4 h-4" />
            <span>Course Content Builder</span>
          </Link>
          <Link
            href="/admin/students"
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-zinc-100 text-xs font-medium flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Student Matrix</span>
          </Link>
        </div>
      </div>

      {/* Neon Dark KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden space-y-3"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Total Gross Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-glow">
              <DollarSign className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-100 font-mono">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-400 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% this month</span>
          </div>
        </motion.div>

        {/* KPI 2: Active Students */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden space-y-3"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Active Students</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-glow-purple">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-100 font-mono">
            {activeStudents}
          </div>
          <div className="text-xs text-zinc-400 font-mono">
            Enrolled in active cohorts
          </div>
        </motion.div>

        {/* KPI 3: Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Avg Completion Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-teal-400 font-mono">
            {completionRate}%
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-teal-400 rounded-full shadow-glow"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </motion.div>

        {/* KPI 4: Drop-off Alert */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden space-y-3 border-amber-500/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Stuck Student Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {stuckStudents}
          </div>
          <div className="text-xs text-amber-300/80 font-mono">
            Requires follow-up intervention
          </div>
        </motion.div>

      </div>

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Retention Curve Visualizer */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                <span>Course Retention Curve (%)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Lesson-by-lesson student drop-off rate</p>
            </div>
            <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20">
              Serum Masterclass
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {retentionCurve.map((item) => (
              <div key={item.lesson} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-300">{item.lesson}</span>
                  <span className="text-teal-400 font-semibold">{item.retention}%</span>
                </div>
                <div className="h-3 w-full rounded-md bg-zinc-950 overflow-hidden border border-zinc-800/60 flex items-center">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.retention}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-r-md shadow-glow"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Preview Streams Visualizer */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-purple-400" />
                <span>Global Audio Player Streams</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Weekly beat & sample audition activity</p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
              7,590 Total Plays
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyStreams.map((item) => {
              const maxStreams = 1500;
              const heightPercent = (item.streams / maxStreams) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono text-zinc-400">{item.streams}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8 }}
                    className="w-full bg-gradient-to-t from-purple-600 to-teal-400 rounded-t-lg shadow-glow-purple hover:brightness-125 transition-all"
                  />
                  <span className="text-xs font-mono text-zinc-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Transaction & Activity Log */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Recent Platform Purchases</span>
          </h3>
          <Link href="/store" className="text-xs font-mono text-teal-400 hover:underline flex items-center gap-1">
            <span>View Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {purchases.map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded font-mono uppercase bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  {p.productType}
                </span>
                <span className="text-zinc-200 font-mono">{p.id}</span>
                <span className="text-zinc-400">Ref: {p.referenceId}</span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span className="text-zinc-400">{p.createdAt}</span>
                <span className="text-teal-400 font-bold">${p.amount}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
