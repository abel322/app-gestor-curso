"use client";

import React, { useState, useEffect } from "react";
import { ProductType, ProductStatus } from "@prisma/client";
import { 
  X, 
  Save, 
  Sparkles, 
  Music, 
  Disc, 
  GraduationCap, 
  Layers, 
  Play, 
  Pause,
  Upload,
  DollarSign,
  Tag,
  FileText,
  Clock,
  Radio,
  FileArchive,
  Volume2
} from "lucide-react";
import { ProductFormData } from "./actions";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: any | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: 29.99,
    salePrice: null,
    type: ProductType.SAMPLE_PACK,
    category: "Trap",
    status: ProductStatus.DRAFT,
    isFeatured: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop",
    previewAudioUrl: "",
    downloadFileUrl: "",
    fileSize: "",
    bpm: 140,
    key: "C Minor",
    formatInfo: "",
  });

  const [loading, setLoading] = useState(false);
  const [testingAudio, setTestingAudio] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        salePrice: initialData.salePrice || null,
        type: initialData.type || ProductType.SAMPLE_PACK,
        category: initialData.category || "General",
        status: initialData.status || ProductStatus.DRAFT,
        isFeatured: Boolean(initialData.isFeatured),
        thumbnailUrl: initialData.thumbnailUrl || "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop",
        previewAudioUrl: initialData.previewAudioUrl || "",
        downloadFileUrl: initialData.downloadFileUrl || "",
        fileSize: initialData.fileSize || "",
        bpm: initialData.bpm || null,
        key: initialData.key || "",
        formatInfo: initialData.formatInfo || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: 29.99,
        salePrice: null,
        type: ProductType.SAMPLE_PACK,
        category: "Trap",
        status: ProductStatus.DRAFT,
        isFeatured: false,
        thumbnailUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop",
        previewAudioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=sample-preview.mp3",
        downloadFileUrl: "https://storage.synthesis.studio/packs/sample-pack.zip",
        fileSize: "450 MB",
        bpm: 140,
        key: "C Minor",
        formatInfo: "50 WAV Loops + 20 MIDIs",
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    return () => {
      if (audioObj) {
        audioObj.pause();
      }
    };
  }, [audioObj]);

  if (!isOpen) return null;

  const toggleTestAudio = () => {
    if (!formData.previewAudioUrl) return;
    
    if (testingAudio && audioObj) {
      audioObj.pause();
      setTestingAudio(false);
    } else {
      if (audioObj) {
        audioObj.pause();
      }
      const newAudio = new Audio(formData.previewAudioUrl);
      newAudio.play().then(() => {
        setTestingAudio(true);
      }).catch(err => {
        console.error("Audio playback error:", err);
        setTestingAudio(false);
      });
      newAudio.onended = () => setTestingAudio(false);
      setAudioObj(newAudio);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (audioObj) audioObj.pause();
      setTestingAudio(false);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#0d0f17] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-100 font-mono">
                {initialData ? "✏️ Editar Producto" : "➕ Crear Nuevo Producto"}
              </h2>
              <p className="text-xs text-zinc-400 font-sans">
                Configura metadatos, reproductor de preview y archivos protegidos para PostgreSQL.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (audioObj) audioObj.pause();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Tipo de Producto Selector */}
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Tipo de Producto *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { type: ProductType.COURSE, label: "Curso Online", icon: GraduationCap, color: "border-purple-500/40 text-purple-400 bg-purple-500/10" },
                { type: ProductType.SAMPLE_PACK, label: "Sample Pack", icon: Disc, color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10" },
                { type: ProductType.LOOP, label: "Loops / Bucles", icon: Music, color: "border-teal-500/40 text-teal-400 bg-teal-500/10" },
                { type: ProductType.TRACK, label: "Beat / Pista", icon: Radio, color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
                { type: ProductType.BUNDLE, label: "Bundle Pack", icon: Layers, color: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
              ].map((item) => {
                const isSelected = formData.type === item.type;
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: item.type })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-mono transition-all ${
                      isSelected
                        ? `${item.color} border-2 shadow-glow font-bold`
                        : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Título */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-300">Título del Producto *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="ej: CYBERPUNK 2099 - Drum Kit & WAV Samples"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 font-sans"
              />
            </div>

            {/* Categoría */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-300">Categoría / Género *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="ej: Trap, Lo-Fi, Mezcla, Afrobeat, Serum"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Precio ($) */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-300">Precio Regular (USD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>

            {/* Precio en Oferta ($) */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-300">Precio de Oferta (Opcional)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.salePrice ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salePrice: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="ej: 19.99"
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>

          </div>

          {/* Carátula (Thumbnail URL) & Descripción */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-300">URL Imagen de Carátula (JPG/PNG) *</label>
              <input
                type="url"
                required
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-300">Descripción del Producto *</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalla qué incluye el producto, stems, licencias comerciales, presets..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 font-sans"
              />
            </div>
          </div>

          {/* Metadatos Específicos de Audio & Loops (BPM, Key, Formato, Tamaño ZIP) */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
            <h3 className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
              <Music className="w-4 h-4 text-teal-400" />
              <span>Metadatos de Audio, Archivos & Especificaciones</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* BPM */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400">BPM (Tempo)</label>
                <input
                  type="number"
                  placeholder="ej: 140"
                  value={formData.bpm ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bpm: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              {/* Key */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400">Tonalidad / Key</label>
                <input
                  type="text"
                  placeholder="ej: C Minor, F# Major"
                  value={formData.key ?? ""}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Tamaños / Tamaño Archivo */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400">Tamaño de Archivo</label>
                <input
                  type="text"
                  placeholder="ej: 1.2 GB, 450 MB"
                  value={formData.fileSize ?? ""}
                  onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

            </div>

            {/* Formato Informativo */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-400">Detalles de Formato / Contenido</label>
              <input
                type="text"
                placeholder="ej: 50 WAV Loops + 20 MIDIs + 15 Serum Presets"
                value={formData.formatInfo ?? ""}
                onChange={(e) => setFormData({ ...formData, formatInfo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* URL Audio Preview (Demo MP3 público) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-zinc-300">URL Demo Preview MP3 (Público)</label>
                {formData.previewAudioUrl && (
                  <button
                    type="button"
                    onClick={toggleTestAudio}
                    className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-mono"
                  >
                    {testingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{testingAudio ? "Detener Probar Audio" : "🔊 Probar Reproductor"}</span>
                  </button>
                )}
              </div>
              <input
                type="url"
                placeholder="https://cdn.pixabay.com/download/audio/..."
                value={formData.previewAudioUrl ?? ""}
                onChange={(e) => setFormData({ ...formData, previewAudioUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            {/* URL Archivo Privado Protegido (S3 / R2 ZIP) */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-300">URL Archivo Protegido (ZIP/WAV Privado tras compra)</label>
              <input
                type="text"
                placeholder="https://storage.synthesis.studio/protected/pack.zip"
                value={formData.downloadFileUrl ?? ""}
                onChange={(e) => setFormData({ ...formData, downloadFileUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

          </div>

          {/* Opciones de Estado & Destacado */}
          <div className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 gap-4">
            
            {/* Status Select */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono text-zinc-300">Estado en Tienda:</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-mono text-zinc-200 focus:outline-none focus:border-teal-500"
              >
                <option value={ProductStatus.DRAFT}>📝 BORRADOR (DRAFT)</option>
                <option value={ProductStatus.PUBLISHED}>🚀 PUBLICADO (PUBLISHED)</option>
                <option value={ProductStatus.ARCHIVED}>📦 ARCHIVADO (ARCHIVED)</option>
              </select>
            </div>

            {/* Featured Checkbox */}
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-teal-400 focus:ring-0 focus:ring-offset-0"
              />
              <span>⭐ Marcar como Destacado en Banner</span>
            </label>

          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => {
                if (audioObj) audioObj.pause();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-teal-400 text-zinc-950 font-bold text-xs font-mono hover:bg-teal-300 transition-transform active:scale-95 shadow-glow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Guardando en Postgres..." : initialData ? "Guardar Cambios" : "Crear Producto"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
