"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INITIAL_COURSES } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  Layers, 
  PlayCircle, 
  CheckCircle2, 
  FileText, 
  Download, 
  ArrowLeft,
  Sparkles,
  Award
} from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const course = INITIAL_COURSES.find((c) => c.slug === slug) || INITIAL_COURSES[0];

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const firstLessonId = course.modules[0]?.lessons[0]?.id || "les-1001";

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-teal-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO COURSE CATALOG</span>
      </Link>

      {/* Hero Overview Header */}
      <div className="glass-card rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative overflow-hidden">
        <div className="lg:col-span-2 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>FULL ACCREDITED CURRICULUM</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-zinc-300">
            <span className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Layers className="w-4 h-4 text-teal-400" />
              {course.modules.length} Modules ({totalLessons} Lessons)
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Clock className="w-4 h-4 text-purple-400" />
              On-demand HD Video + Presets
            </span>
          </div>
        </div>

        {/* Action Sidebar Box */}
        <div className="bg-zinc-950/80 p-6 rounded-xl border border-zinc-800/80 space-y-4 text-center">
          <div className="text-2xl font-extrabold text-teal-400 font-mono">
            ${course.price}
          </div>

          <Link
            href={`/courses/${course.slug}/lessons/${firstLessonId}`}
            className="w-full py-3 rounded-xl bg-teal-400 text-zinc-950 font-bold hover:bg-teal-300 transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm shadow-glow"
          >
            <PlayCircle className="w-5 h-5 fill-current" />
            <span>Enter Lesson Player</span>
          </Link>

          <p className="text-[11px] text-zinc-500 font-mono">
            Includes lifetime access to future module updates & MIDI assets.
          </p>
        </div>
      </div>

      {/* Curriculum Accordion / List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <span>Course Modules & Syllabus</span>
        </h2>

        <div className="space-y-4">
          {course.modules.map((mod, mIdx) => (
            <div
              key={mod.id}
              className="glass-card rounded-xl overflow-hidden border border-zinc-800/80"
            >
              {/* Module Bar */}
              <div className="bg-zinc-900/80 px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono font-bold text-xs flex items-center justify-center">
                    {mIdx + 1}
                  </span>
                  <h3 className="font-semibold text-zinc-200 text-sm md:text-base">
                    {mod.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  {mod.lessons.length} Lessons
                </span>
              </div>

              {/* Lesson Items */}
              <div className="divide-y divide-zinc-800/40 bg-[#0d0f17]/50">
                {mod.lessons.map((les) => (
                  <Link
                    key={les.id}
                    href={`/courses/${course.slug}/lessons/${les.id}`}
                    className="p-4 px-6 flex items-center justify-between hover:bg-zinc-800/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle className="w-4 h-4 text-zinc-500 group-hover:text-teal-400 transition-colors" />
                      <div>
                        <h4 className="text-xs md:text-sm font-medium text-zinc-300 group-hover:text-zinc-100">
                          {les.title}
                        </h4>
                        {les.attachments.length > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            {les.attachments.map((att) => (
                              <span
                                key={att.id}
                                className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20"
                              >
                                📎 {att.fileType}: {att.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                      <span>{Math.round(les.duration / 60)} min</span>
                      <span className="text-teal-400 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
