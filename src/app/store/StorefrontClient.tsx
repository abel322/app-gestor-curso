"use client";

import React, { useState } from "react";
import { useAudio } from "@/context/audio-context";
import { motion } from "framer-motion";
import { 
  Play, 
  Pause, 
  Search, 
  Sparkles, 
  ShoppingBag,
  Zap,
  ArrowRight,
  Check,
  Music,
  GraduationCap,
  Disc,
  Radio,
  Layers,
  Download,
  Star
} from "lucide-react";
import { ProductType } from "@prisma/client";

interface StorefrontClientProps {
  initialProducts: any[];
}

export default function StorefrontClient({ initialProducts }: StorefrontClientProps) {
  const [products] = useState<any[]>(initialProducts);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [checkoutModalProduct, setCheckoutModalProduct] = useState<any | null>(null);

  const { currentTrack, isPlaying, playTrack } = useAudio();

  const filterOptions = [
    { key: "ALL", label: "TODOS" },
    { key: ProductType.COURSE, label: "CURSOS" },
    { key: ProductType.SAMPLE_PACK, label: "LIBRERÍAS SAMPLES" },
    { key: ProductType.LOOP, label: "LOOPS" },
    { key: ProductType.TRACK, label: "BEATS / PISTAS" },
    { key: ProductType.BUNDLE, label: "BUNDLES" },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesType = filterType === "ALL" || p.type === filterType;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.key && p.key.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handlePurchase = (product: any) => {
    setCheckoutModalProduct(product);
  };

  const confirmPurchase = () => {
    if (!checkoutModalProduct) return;
    setPurchasedIds((prev) => [...prev, checkoutModalProduct.id]);
    setCheckoutModalProduct(null);
  };

  const getTypeBadge = (type: ProductType) => {
    switch (type) {
      case ProductType.COURSE:
        return { label: "CURSO", color: "bg-purple-500/10 text-purple-400 border-purple-500/30", icon: GraduationCap };
      case ProductType.SAMPLE_PACK:
        return { label: "SAMPLE PACK", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30", icon: Disc };
      case ProductType.LOOP:
        return { label: "LOOP", color: "bg-teal-500/10 text-teal-400 border-teal-500/30", icon: Music };
      case ProductType.TRACK:
        return { label: "BEAT / PISTA", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: Radio };
      case ProductType.BUNDLE:
        return { label: "BUNDLE", color: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: Layers };
      default:
        return { label: type, color: "bg-zinc-800 text-zinc-300 border-zinc-700", icon: Sparkles };
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-zinc-950 via-[#0d0f17] to-zinc-950 border border-zinc-800/80 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CATÁLOGO DIRECTO DE PRODUCTOR & ACADEMIA</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Cursos, Kits de Sonido y Beats <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">de Alto Rendimiento</span>
          </h1>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            Licencias de beats libres de regalías, librerías de samples, bucles cuantizados y masterclasses profesionales sincronizadas con PostgreSQL en tiempo real. Preescucha pistas instantáneamente.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/admin/products"
              className="px-5 py-2.5 rounded-xl bg-teal-400 text-zinc-950 font-bold hover:bg-teal-300 transition-transform active:scale-95 flex items-center gap-2 text-sm shadow-glow font-mono"
            >
              <span>📦 Abrir Gestor de Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/courses"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-colors text-sm font-mono flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Ver Cursos Online</span>
            </a>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/90 backdrop-blur-md p-4 rounded-xl border border-zinc-800/80 shadow-lg">
        
        {/* Type Badges */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilterType(opt.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                filterType === opt.key
                  ? "bg-teal-400 text-zinc-950 font-bold shadow-glow"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por título, key, categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/60"
          />
        </div>

      </div>

      {/* Product Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
          <Music className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-zinc-400 text-sm font-mono">No hay productos disponibles para los criterios seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => {
            const typeInfo = getTypeBadge(product.type);
            const Icon = typeInfo.icon;
            const audioUrl = product.previewAudioUrl || product.audioDemoUrl;
            const isCurrentlyPlaying = currentTrack?.id === product.id && isPlaying;
            const isPurchased = purchasedIds.includes(product.id);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-zinc-900/80 bg-zinc-900/80-hover rounded-xl p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden bg-[#0c0e17] border border-zinc-800/80 hover:border-teal-500/40 transition-all"
              >
                
                {/* Product Thumbnail Header */}
                <div className="relative h-40 w-full rounded-lg bg-zinc-900 overflow-hidden mb-2">
                  <img
                    src={product.thumbnailUrl || product.image || "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-transparent to-black/30" />
                  
                  <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider border flex items-center gap-1 ${typeInfo.color}`}>
                    <Icon className="w-3 h-3" />
                    <span>{typeInfo.label}</span>
                  </span>

                  {product.isFeatured && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-400 text-zinc-950 flex items-center gap-1 shadow-glow">
                      <Star className="w-3 h-3 fill-current" />
                      <span>TOP</span>
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="space-y-3 flex-1">
                  
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>🏷️ {product.category}</span>
                    {product.bpm && <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{product.bpm} BPM</span>}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-zinc-100 group-hover:text-teal-300 transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Spec Metadata tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                    {product.key && (
                      <span className="text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                        🔑 {product.key}
                      </span>
                    )}
                    {product.fileSize && (
                      <span className="text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        📦 {product.fileSize}
                      </span>
                    )}
                  </div>

                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  
                  {/* Preview Audio Player Button */}
                  {audioUrl ? (
                    <button
                      onClick={() =>
                        playTrack({
                          id: product.id,
                          title: product.title,
                          audioDemoUrl: audioUrl,
                          productType: product.type || "MUSIC_ASSET",
                          price: product.salePrice || product.price,
                        })
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                        isCurrentlyPlaying
                          ? "bg-teal-400 text-zinc-950 font-bold shadow-glow animate-pulse"
                          : "bg-zinc-900 text-zinc-200 hover:bg-zinc-800 border border-zinc-700/60"
                      }`}
                    >
                      {isCurrentlyPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Sonando</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current text-teal-400" />
                          <span>Demo</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-zinc-500 italic">No Demo</span>
                  )}

                  {/* Price & Purchase CTA */}
                  {isPurchased ? (
                    <a
                      href="/account/downloads"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1 hover:bg-emerald-500/20"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Comprado</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => handlePurchase(product)}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-400 hover:text-zinc-950 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {product.salePrice ? (
                        <span>${product.salePrice} <span className="line-through text-zinc-500 text-xs">${product.price}</span></span>
                      ) : (
                        <span>${product.price}</span>
                      )}
                    </button>
                  )}

                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative font-sans"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-zinc-100 font-mono">Confirmar Pedido Digital</h3>
              </div>
              <button
                onClick={() => setCheckoutModalProduct(null)}
                className="text-zinc-400 hover:text-zinc-100 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <h4 className="font-semibold text-zinc-100 text-sm">{checkoutModalProduct.title}</h4>
              <p className="text-xs text-zinc-400">{checkoutModalProduct.description}</p>
              <div className="flex justify-between items-center pt-2 text-xs font-mono">
                <span className="text-zinc-400">Licencia Comercial Incluida</span>
                <span className="text-teal-400 font-bold text-base">
                  ${checkoutModalProduct.salePrice || checkoutModalProduct.price}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmPurchase}
                className="w-full py-3 rounded-xl bg-teal-400 text-zinc-950 font-bold font-mono hover:bg-teal-300 transition-transform active:scale-98 shadow-glow flex items-center justify-center gap-2 text-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Completar Compra (${checkoutModalProduct.salePrice || checkoutModalProduct.price})</span>
              </button>
              <p className="text-[11px] text-center text-zinc-500 font-mono">
                Sincronizado con PostgreSQL. Entrega directa a tu panel de descargas.
              </p>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
