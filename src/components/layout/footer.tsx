import React from "react";
import { Sparkles, Disc, ShieldCheck, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#06070a] border-t border-zinc-800/80 pt-10 pb-24 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-teal-500/40 flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-teal-400" />
            </div>
            <span className="font-extrabold text-zinc-200 font-mono tracking-wider">SYNTHESIS.AUDIO</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Plataforma LMS y Tienda Musical Todo-en-Uno. Diseñada para productores musicales, diseñadores de sonido y educadores de música electrónica.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h5 className="text-xs uppercase tracking-widest text-zinc-300 font-mono mb-3 font-semibold">Plataforma LMS</h5>
          <ul className="space-y-2 text-xs">
            <li><a href="/courses" className="hover:text-teal-400 transition-colors">Catálogo de Cursos</a></li>
            <li><a href="/admin/courses/builder" className="hover:text-teal-400 transition-colors">Creador de Contenido Interactivo</a></li>
            <li><a href="/admin/dashboard" className="hover:text-teal-400 transition-colors">Matriz de Progreso de Estudiantes</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h5 className="text-xs uppercase tracking-widest text-zinc-300 font-mono mb-3 font-semibold">Tienda Musical</h5>
          <ul className="space-y-2 text-xs">
            <li><a href="/store" className="hover:text-teal-400 transition-colors">Beats y Stems de Producción</a></li>
            <li><a href="/store" className="hover:text-teal-400 transition-colors">Presets para Serum y Synths</a></li>
            <li><a href="/store" className="hover:text-teal-400 transition-colors">Packs de Progresiones MIDI</a></li>
            <li><a href="/account/downloads" className="hover:text-teal-400 transition-colors">Mis Descargas Adquiridas</a></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h5 className="text-xs uppercase tracking-widest text-zinc-300 font-mono mb-3 font-semibold">Arquitectura del Sistema</h5>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              <span>Next.js 14 App Router + Server Actions</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Prisma ORM & UI Neón Oscuro</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Disc className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Reproductor Global con Forma de Onda</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500">
        <p>© 2026 SYNTHESIS AUDIO INC. TODOS LOS DERECHOS RESERVADOS.</p>
        <p className="font-mono text-zinc-600">DISEÑO NEÓN OSCURO • LMS DE ALTO RENDIMIENTO</p>
      </div>
    </footer>
  );
}
