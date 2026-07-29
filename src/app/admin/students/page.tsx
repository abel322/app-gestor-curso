"use client";

import React, { useState } from "react";
import { INITIAL_USERS, INITIAL_PROGRESS } from "@/lib/mock-data";
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Mail
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
            <span>TELEMETRÍA Y PROGRESIÓN DE ESTUDIANTES</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Matriz de Progresión y Deserción de Estudiantes
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Supervisa los porcentajes de finalización, abandonos de lecciones y activa alertas de apoyo para estudiantes atascados.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Filtrar por nombre o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-purple-500/60"
          />
        </div>
      </div>

      {/* Student Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider">
                <th className="p-4 pl-6">Nombre y Correo del Estudiante</th>
                <th className="p-4">Curso Inscrito</th>
                <th className="p-4">% de Finalización</th>
                <th className="p-4">Estado</th>
                <th className="p-4 pr-6 text-right">Acción de Intervención</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredUsers.map((student) => {
                const studentProgress = progress.filter((p) => p.userId === student.id);
                const completedCount = studentProgress.filter((p) => p.completed).length;
                const totalTarget = 4;
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
                      Masterclass de Diseño de Sonido en Serum
                    </td>

                    <td className="p-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-zinc-400">{completedCount}/{totalTarget} Lecciones</span>
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
                          <span>ATASCADO / ABANDONO</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PROGRESANDO ACTIVO</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      {isStuck ? (
                        <a
                          href={`mailto:${student.email}?subject=%C2%BFNecesitas%20ayuda%20con%20la%20Masterclass%20de%20Serum?`}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono hover:bg-amber-500/30 transition-colors inline-flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
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

    </div>
  );
}
