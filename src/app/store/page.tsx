"use client";

import React, { useState } from "react";
import { INITIAL_MUSIC_PRODUCTS, MusicProductMock } from "@/lib/mock-data";
import { useAudio } from "@/context/audio-context";
import { motion } from "framer-motion";
import { 
  Play, 
  Pause, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Disc, 
  Layers, 
  FileMusic, 
  Download, 
  Check, 
  ShoppingBag,
  Zap,
  ArrowRight
} from "lucide-react";

export default function StorefrontPage() {
  const [products, setProducts] = useState<MusicProductMock[]>(INITIAL_MUSIC_PRODUCTS);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [checkoutModalProduct, setCheckoutModalProduct] = useState<MusicProductMock | null>(null);

  const { currentTrack, isPlaying, playTrack } = useAudio();

  const filteredProducts = products.filter((p) => {
    const matchesType = filterType === "ALL" || p.productType === filterType;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.key && p.key.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handlePurchase = (product: MusicProductMock) => {
    setCheckoutModalProduct(product);
  };

  const confirmPurchase = () => {
    if (!checkoutModalProduct) return;
    setPurchasedIds((prev) => [...prev, checkoutModalProduct.id]);
    setCheckoutModalProduct(null);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "BEAT":
        return "bg-teal-500/10 text-teal-400 border-teal-500/30 shadow-glow";
      case "PRESET":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-glow-purple";
      case "SAMPLE_PACK":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "MIDI":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
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
            <span>DIRECT PRODUCER CATALOG</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            High-Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Sound Kits & Beats</span>
          </h1>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            Instant royalty-free beat licenses, Xfer Serum preset banks, multi-sampled drum kits, and MIDI progression packs. Audition tracks with our real-time global audio engine.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/courses"
              className="px-5 py-2.5 rounded-xl bg-teal-400 text-zinc-950 font-semibold hover:bg-teal-300 transition-transform active:scale-95 flex items-center gap-2 text-sm shadow-glow"
            >
              <span>Explore LMS Masterclasses</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/admin/dashboard"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Admin KPI Dashboard</span>
            </a>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#111319]/90 backdrop-blur-md p-4 rounded-xl border border-zinc-800/80 shadow-lg">
        
        {/* Type Badges */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {["ALL", "BEAT", "SAMPLE_PACK", "PRESET", "MIDI"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                filterType === type
                  ? "bg-teal-400 text-zinc-950 font-bold shadow-glow"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {type.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search title, key, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/60"
          />
        </div>

      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => {
          const isCurrentlyPlaying = currentTrack?.id === product.id && isPlaying;
          const isPurchased = purchasedIds.includes(product.id);

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card glass-card-hover rounded-xl p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              {/* Product Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${getTypeBadgeColor(product.productType)}`}>
                    {product.productType.replace("_", " ")}
                  </span>
                  
                  {product.bpm && (
                    <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {product.bpm} BPM
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-base text-zinc-100 group-hover:text-teal-300 transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Tags (Key, Specs) */}
                <div className="flex items-center gap-2 pt-1">
                  {product.key && (
                    <span className="text-[11px] font-mono text-teal-400/90 bg-teal-500/5 px-2 py-0.5 rounded border border-teal-500/20">
                      Key: {product.key}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar (Audio Play + Buy / Download) */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                
                {/* Audio Preview Play Button */}
                <button
                  onClick={() =>
                    playTrack({
                      id: product.id,
                      title: product.title,
                      audioDemoUrl: product.audioDemoUrl,
                      productType: product.productType,
                      price: product.price,
                    })
                  }
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isCurrentlyPlaying
                      ? "bg-teal-400 text-zinc-950 font-bold shadow-glow animate-pulse"
                      : "bg-zinc-900 text-zinc-200 hover:bg-zinc-800 border border-zinc-700/60"
                  }`}
                >
                  {isCurrentlyPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Playing</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-teal-400" />
                      <span>Preview</span>
                    </>
                  )}
                </button>

                {/* Buy Button */}
                {isPurchased ? (
                  <a
                    href="/account/downloads"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Owned</span>
                  </a>
                ) : (
                  <button
                    onClick={() => handlePurchase(product)}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-400 hover:text-zinc-950 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>${product.price}</span>
                  </button>
                )}

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Checkout Modal Simulation */}
      {checkoutModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111319] border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-zinc-100">Confirm Order</h3>
              </div>
              <button
                onClick={() => setCheckoutModalProduct(null)}
                className="text-zinc-400 hover:text-zinc-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <h4 className="font-semibold text-zinc-100 text-sm">{checkoutModalProduct.title}</h4>
              <p className="text-xs text-zinc-400">{checkoutModalProduct.description}</p>
              <div className="flex justify-between items-center pt-2 text-xs font-mono">
                <span className="text-zinc-400">License: Royalty-Free Commercial</span>
                <span className="text-teal-400 font-bold text-base">${checkoutModalProduct.price}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmPurchase}
                className="w-full py-3 rounded-xl bg-teal-400 text-zinc-950 font-bold hover:bg-teal-300 transition-transform active:scale-98 shadow-glow flex items-center justify-center gap-2 text-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Complete Purchase (${checkoutModalProduct.price})</span>
              </button>
              <p className="text-[11px] text-center text-zinc-500 font-mono">
                Instant delivery to your account downloads upon confirmation.
              </p>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
