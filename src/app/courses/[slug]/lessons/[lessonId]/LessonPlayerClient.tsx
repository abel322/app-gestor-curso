"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CourseMock, LessonMock } from "@/lib/mock-data";
import { 
  CheckCircle2, 
  Download, 
  FileText, 
  MessageSquare, 
  ArrowLeft, 
  ArrowRight,
  Layers,
  Check,
  Disc
} from "lucide-react";

interface LessonPlayerClientProps {
  course: CourseMock;
  lessonId: string;
}

export default function LessonPlayerClient({ course, lessonId }: LessonPlayerClientProps) {
  const [completed, setCompleted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"NOTES" | "ATTACHMENTS" | "DISCUSSION">("NOTES");

  let currentLesson: LessonMock | null = null;
  let currentModuleTitle = "";

  for (const mod of course.modules) {
    const found = mod.lessons.find((l) => l.id === lessonId);
    if (found) {
      currentLesson = found;
      currentModuleTitle = mod.title;
      break;
    }
  }

  if (!currentLesson) {
    currentLesson = course.modules[0]?.lessons[0] || null;
    currentModuleTitle = course.modules[0]?.title || "";
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <Link
          href={`/courses/${course.slug}`}
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER AL TEMARIO</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCompleted(!completed)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              completed
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow"
                : "bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-teal-500/50"
            }`}
          >
            {completed ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>COMPLETADO</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>MARCAR COMO COMPLETADO</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video Player */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-800/80 aspect-video shadow-2xl">
            {currentLesson?.videoUrl ? (
              <iframe
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-zinc-950">
                <Disc className="w-12 h-12 text-teal-400 animate-spin mb-3" />
                <h3 className="text-zinc-200 font-semibold">Reproductor de Video / Audio</h3>
                <p className="text-zinc-500 text-xs mt-1">Selecciona una lección para iniciar la reproducción.</p>
              </div>
            )}
          </div>

          {/* Lesson Header */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/30">
              {currentModuleTitle}
            </span>
            <h1 className="text-2xl font-extrabold text-zinc-100 mt-2">
              {currentLesson?.title}
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-zinc-800 flex items-center gap-4">
            <button
              onClick={() => setActiveTab("NOTES")}
              className={`pb-3 text-xs font-mono uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "NOTES"
                  ? "border-teal-400 text-teal-300 font-bold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notas de la Lección</span>
            </button>

            <button
              onClick={() => setActiveTab("ATTACHMENTS")}
              className={`pb-3 text-xs font-mono uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all relative ${
                activeTab === "ATTACHMENTS"
                  ? "border-teal-400 text-teal-300 font-bold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Archivos Adjuntos ({currentLesson?.attachments?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("DISCUSSION")}
              className={`pb-3 text-xs font-mono uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "DISCUSSION"
                  ? "border-teal-400 text-teal-300 font-bold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discusión</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="glass-card rounded-xl p-6 min-h-[160px]">
            {activeTab === "NOTES" && (
              <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed">
                <p>{currentLesson?.content || "Sin notas de la lección disponibles."}</p>
              </div>
            )}

            {activeTab === "ATTACHMENTS" && (
              <div className="space-y-3">
                {currentLesson?.attachments && currentLesson.attachments.length > 0 ? (
                  currentLesson.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase">
                          {att.fileType}
                        </span>
                        <span className="text-xs font-medium text-zinc-200">{att.title}</span>
                      </div>

                      <a
                        href={att.fileUrl}
                        download
                        className="px-3 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-mono hover:bg-purple-500/30 transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-xs font-mono">No hay archivos adjuntos en esta lección.</p>
                )}
              </div>
            )}

            {activeTab === "DISCUSSION" && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                    ER
                  </div>
                  <div className="flex-1 bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-200 font-semibold">Elena Rostova</span>
                      <span className="text-zinc-500">Hace 2 horas</span>
                    </div>
                    <p className="text-xs text-zinc-300">
                      ¡Excelente explicación sobre la profundidad de modulación FM! ¿Qué ajuste funciona mejor para evitar la incompatibilidad mono en subgraves?
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Haz una pregunta o comparte tu comentario..."
                    className="flex-1 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-teal-500/60"
                  />
                  <button className="px-4 py-2 rounded-xl bg-teal-400 text-zinc-950 font-bold text-xs hover:bg-teal-300">
                    Publicar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            {prevLesson ? (
              <Link
                href={`/courses/${course.slug}/lessons/${prevLesson.id}`}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-medium flex items-center gap-2 max-w-[45%]"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="truncate">Anterior: {prevLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/courses/${course.slug}/lessons/${nextLesson.id}`}
                className="px-4 py-2 rounded-xl bg-teal-400 text-zinc-950 font-bold text-xs hover:bg-teal-300 shadow-glow flex items-center gap-2 max-w-[45%]"
              >
                <span className="truncate">Siguiente: {nextLesson.title}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            ) : (
              <div />
            )}
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4 border border-zinc-800/80 space-y-4">
            <h3 className="font-bold text-sm text-zinc-200 font-mono uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Lista de Lecciones</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {(course.modules || []).map((mod, mIdx) => (
                <div key={mod.id} className="space-y-1.5">
                  <div className="text-[11px] font-mono text-zinc-400 font-semibold px-2">
                    M{mIdx + 1}: {mod.title}
                  </div>
                  <div className="space-y-1">
                    {(mod.lessons || []).map((les) => {
                      const isActive = les.id === lessonId;
                      return (
                        <Link
                          key={les.id}
                          href={`/courses/${course.slug}/lessons/${les.id}`}
                          className={`p-2.5 rounded-lg flex items-center justify-between text-xs transition-all ${
                            isActive
                              ? "bg-teal-500/10 text-teal-300 border border-teal-500/40 font-semibold shadow-glow"
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Disc className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-teal-400 animate-spin" : "text-zinc-500"}`} />
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-500">
                            {Math.round((les.duration || 0) / 60)}m
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
