"use client";

import React, { useState } from "react";
import { INITIAL_MUSIC_PRODUCTS } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { 
  Download, 
  CheckCircle2
} from "lucide-react";

export default function DownloadsPage() {
  const [products] = useState(INITIAL_MUSIC_PRODUCTS);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono mb-2">
          <Download className="w-3.5 h-3.5" />
          <span>CENTRO SEGURO DE DESCARGA DE RECURSOS</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
          Mis Recursos Comprados y Descargas
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Accede a enlaces de descarga de por vida para archivos zip de stems de beats, bancos de presets de Serum y librerías de samples.
        </p>
      </div>

      {/* Purchased Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4 border border-zinc-800/80 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  {product.productType === "SAMPLE_PACK" ? "LIBRERÍA DE SAMPLES" : product.productType}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>LICENCIA COMERCIAL VERIFICADA</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-zinc-100">{product.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{product.description}</p>
              </div>

              {product.bpm && (
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <span>BPM: {product.bpm}</span>
                  <span>•</span>
                  <span>Tonalidad: {product.key}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">Formato: Archivos WAV / FXP / MIDI en ZIP</span>

              <a
                href={product.downloadZipUrl}
                download
                onClick={() => alert(`Simulando descarga encriptada segura de: ${product.title}`)}
                className="px-4 py-2 rounded-xl bg-teal-400 text-zinc-950 font-bold text-xs hover:bg-teal-300 transition-transform active:scale-95 flex items-center gap-2 shadow-glow"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Recurso (.zip)</span>
              </a>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
}
