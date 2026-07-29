"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_COURSES, CourseMock } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  PlayCircle, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function CoursesPage() {
  const [courses] = useState<CourseMock[]>(INITIAL_COURSES);

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>LMS ACADEMY & MASTERCLASSES</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Sound Design & Production Masterclasses
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
            Structured modules with video lessons, downloadable Serum synth presets, MIDI progression attachments, and real-time student tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses/builder"
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-teal-500/40 text-teal-300 text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-glow flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Open Content Builder</span>
          </Link>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course, idx) => {
          const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
          const totalDurationSecs = course.modules.reduce(
            (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.duration, 0),
            0
          );
          const durationMins = Math.round(totalDurationSecs / 60);

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              {/* Image & Status Badge */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111319] via-transparent to-black/30" />
                
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold shadow-lg ${
                      course.status === "PUBLISHED"
                        ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 space-y-3">
                <h3 className="font-bold text-lg text-zinc-100 group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Course Metadata */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60 text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                    <span>{course.modules.length} Modules ({totalLessons} Lessons)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>~{durationMins} Mins Total</span>
                  </div>
                </div>
              </div>

              {/* Footer / CTA */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-zinc-800/40 mt-3">
                <span className="text-base font-extrabold text-teal-400 font-mono">
                  ${course.price}
                </span>

                <Link
                  href={`/courses/${course.slug}`}
                  className="px-4 py-2 rounded-xl bg-teal-400 text-zinc-950 font-bold text-xs hover:bg-teal-300 transition-transform active:scale-95 flex items-center gap-1.5 shadow-glow"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
