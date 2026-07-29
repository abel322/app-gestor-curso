"use client";

import React, { useState } from "react";
import { INITIAL_USERS, INITIAL_PROGRESS, INITIAL_COURSES } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Mail, 
  Layers,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function StudentMatrixPage() {
  const [users] = useState(INITIAL_USERS.filter((u) => u.role === "STUDENT"));
  const [progress] = useState(INITIAL_PROGRESS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>STUDENT TELEMETRY & PROGRESSION</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Student Progression & Dropout Matrix
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Monitor student completion percentages, lesson drop-offs, and trigger stuck student support alerts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-purple-500/60"
          />
        </div>
      </div>

      {/* Student Telemetry Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider">
                <th className="p-4 pl-6">Student Name & Email</th>
                <th className="p-4">Enrolled Course</th>
                <th className="p-4">Completion %</th>
                <th className="p-4">Status Flag</th>
                <th className="p-4 pr-6 text-right">Intervention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredUsers.map((student) => {
                const studentProgress = progress.filter((p) => p.userId === student.id);
                const completedCount = studentProgress.filter((p) => p.completed).length;
                const totalTarget = 4; // demo target lessons
                const percent = Math.round((completedCount / totalTarget) * 100);

                const isStuck = percent < 50;

                return (
                  <tr key={student.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs">
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-100">{student.name}</div>
                          <div className="text-zinc-500 text-[11px] font-mono flex items-center gap-1">
                            <Mail className="w-3 h-3 text-zinc-500" />
                            <span>{student.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-zinc-300">
                      Serum Sound Design Masterclass
                    </td>

                    <td className="p-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-zinc-400">{completedCount}/{totalTarget} Lessons</span>
                          <span className="text-teal-400 font-bold">{percent}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                          <div
                            className="h-full bg-teal-400 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {isStuck ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3 animate-pulse" />
                          <span>STUCK / DROP-OFF</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ACTIVE PROGRESSING</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      {isStuck ? (
                        <a
                          href={`mailto:${student.email}?subject=Need%20help%20with%20Serum%20Masterclass?`}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono hover:bg-amber-500/30 transition-colors inline-flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Send Support Nudge</span>
                        </a>
                      ) : (
                        <span className="text-zinc-500 text-[11px] font-mono">On Track</span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
