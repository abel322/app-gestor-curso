"use client";

import React, { useState } from "react";
import { CourseMock, UserMock, CourseProgressMock } from "@/lib/mock-data";
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Mail,
  BookOpen,
  BarChart3,
  Sparkles
} from "lucide-react";

interface StudentMatrixClientProps {
  initialCourses: CourseMock[];
  initialUsers: UserMock[];
  initialProgress: CourseProgressMock[];
}

export default function StudentMatrixClient({
  initialCourses,
  initialUsers,
  initialProgress
}: StudentMatrixClientProps) {
  const [courses] = useState(initialCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourses[0]?.id || "");
  const [users] = useState(initialUsers.filter((u) => u.role === "STUDENT"));
  const [progress] = useState(initialProgress);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0] || null;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock enrollment data mapped by course
  const courseEnrollments: Record<string, { enrolledCount: number; avgCompletion: number; stuckLesson: string; stuckCount: number }> = {
    "crs-mezcla": {
      enrolledCount: 38,
      avgCompletion: 42,
      stuckLesson: "Lección 1.1: Limpieza de Frecuencias y Filtros Paso Alto",
      stuckCount: 14,
    },
    "crs-1": {
      enrolledCount: 54,
      avgCompletion: 68,
      stuckLesson: "Lección 1.2: Diseño de Bajos Reese Pesados y Modulación FM",
      stuckCount: 8,
    },
    "crs-2": {
      enrolledCount: 29,
      avgCompletion: 75,
      stuckLesson: "Lección 1.1: Creación del Bajo Log Drum Característico del Amapiano",
      stuckCount: 3,
    },
  };

  const currentMetrics = courseEnrollments[selectedCourseId] || {
    enrolledCount: 20,
    avgCompletion: 50,
    stuckLesson: "Lección 1.1: Introducción General",
    stuckCount: 5,
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>LMS METRICS & STUDENT TELEMETRY</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Métricas de Estudiantes y Cuellos de Botella
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Revisa inscripciones, % de lecciones completadas e identifica en qué lección se están quedando atascados tus alumnos.
          </p>
        </div>

        {/* Search & Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Filtrar por nombre o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-purple-500/60 font-mono"
            />
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-zinc-800 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-zinc-300 font-bold">No hay cursos creados</h3>
          <p className="text-zinc-500 text-xs">
            Crea un curso en el Creador de Cursos para ver la matriz de telemetría de estudiantes.
          </p>
        </div>
      ) : selectedCourse ? (
        <>
          {/* Course Picker Header Bar */}
          <div className="glass-card rounded-2xl p-6 border border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-glow-purple">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Filtrar por Curso Específico</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="mt-0.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-bold text-sm focus:outline-none focus:border-purple-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Telemetría en tiempo real de cohorte activa</span>
            </div>
          </div>

          {/* Dark/Glow KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Total Enrolled */}
            <div className="glass-card rounded-2xl p-6 border border-zinc-800 relative overflow-hidden space-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase">Estudiantes Inscritos</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-zinc-100 font-mono">
                {currentMetrics.enrolledCount} Alumnos
              </div>
              <p className="text-xs text-zinc-400 font-mono">Inscripciones confirmadas en el curso</p>
            </div>

            {/* Card 2: Completion Percentage */}
            <div className="glass-card rounded-2xl p-6 border border-zinc-800 relative overflow-hidden space-y-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase">Tasa Promedio de Finalización</span>
                <BarChart3 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-3xl font-extrabold text-teal-400 font-mono">
                {currentMetrics.avgCompletion}%
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-teal-400 rounded-full shadow-glow"
                  style={{ width: `${currentMetrics.avgCompletion}%` }}
                />
              </div>
            </div>

            {/* Card 3: Stuck Bottleneck Alert */}
            <div className="glass-card rounded-2xl p-6 border border-amber-500/40 relative overflow-hidden space-y-2 bg-gradient-to-b from-amber-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Punto de Atasco / Deserción</span>
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded">
                  {currentMetrics.stuckCount} alumnos atascados
                </span>
              </div>
              <div className="text-sm font-extrabold text-zinc-100 line-clamp-1" title={currentMetrics.stuckLesson}>
                {currentMetrics.stuckLesson}
              </div>
              <p className="text-xs text-amber-300/80 font-mono">
                ⚠️ Lección detectada con mayor tasa de abandono temporal.
              </p>
            </div>

          </div>

          {/* Student Table */}
          <div className="glass-card rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl space-y-4">
            <div className="p-4 px-6 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-zinc-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Listado de Alumnos del "{selectedCourse.title}"</span>
              </h3>
              <span className="text-xs font-mono text-zinc-400">Mostrando {filteredUsers.length} registros</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider">
                    <th className="p-4 pl-6">Nombre y Correo del Estudiante</th>
                    <th className="p-4">Lección Actual</th>
                    <th className="p-4">% Completado</th>
                    <th className="p-4">Estado de Avance</th>
                    <th className="p-4 pr-6 text-right">Acción de Intervención</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300 font-sans">
                  {filteredUsers.map((student, idx) => {
                    // Mock custom progress for demonstration
                    const mockStuck = idx % 2 === 0;
                    const percent = mockStuck ? 35 : 85;
                    const currentLessonTitle = mockStuck
                      ? currentMetrics.stuckLesson
                      : "Lección 2.1: Compresión VCA vs FET";

                    return (
                      <tr key={student.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs border border-purple-500/30">
                              {student.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-zinc-100">{student.name}</div>
                              <div className="text-zinc-500 text-[11px] font-mono flex items-center gap-1">
                                <Mail className="w-3 h-3 text-zinc-500" />
                                <span>{student.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-zinc-300 max-w-xs truncate" title={currentLessonTitle}>
                          {currentLessonTitle}
                        </td>

                        <td className="p-4 font-mono">
                          <div className="w-36 space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-zinc-400">{percent}% de Lecciones</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                              <div
                                className={`h-full rounded-full ${mockStuck ? "bg-amber-400" : "bg-teal-400"}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          {mockStuck ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              <AlertTriangle className="w-3 h-3 animate-pulse" />
                              <span>ATASCADO EN LECCIÓN</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>AVANZANDO NORMAL</span>
                            </span>
                          )}
                        </td>

                        <td className="p-4 pr-6 text-right">
                          {mockStuck ? (
                            <a
                              href={`mailto:${student.email}?subject=%C2%BFNecesitas%20ayuda%20con%20el%20${encodeURIComponent(selectedCourse.title)}?`}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono hover:bg-amber-500/30 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Enviar Recordatorio de Apoyo</span>
                            </a>
                          ) : (
                            <span className="text-zinc-500 text-[11px] font-mono">Al Día</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

    </div>
  );
}
