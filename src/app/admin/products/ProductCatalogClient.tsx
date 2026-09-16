"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductType, ProductStatus } from "@prisma/client";
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Music, 
  GraduationCap, 
  Disc, 
  Radio, 
  Layers, 
  Wrench,
  Download,
  Eye,
  Star
} from "lucide-react";
import ProductModal from "./ProductModal";
import { 
  createProductAction, 
  updateProductAction, 
  togglePublishProductAction, 
  deleteProductAction,
  ProductFormData
} from "./actions";

interface ProductCatalogClientProps {
  initialProducts: any[];
}

export default function ProductCatalogClient({ initialProducts }: ProductCatalogClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Audio Preview State
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePlayPreview = (url?: string | null) => {
    if (!url) {
      notify("⚠️ Este producto no posee un archivo de preescucha audio demo.");
      return;
    }

    if (playingAudioUrl === url && audioRef) {
      audioRef.pause();
      setPlayingAudioUrl(null);
      setAudioRef(null);
    } else {
      if (audioRef) {
        audioRef.pause();
      }
      const newAudio = new Audio(url);
      newAudio.play().then(() => {
        setPlayingAudioUrl(url);
      }).catch(err => {
        console.error(err);
        notify("⚠️ Error al reproducir la demo de audio.");
        setPlayingAudioUrl(null);
      });
      newAudio.onended = () => setPlayingAudioUrl(null);
      setAudioRef(newAudio);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesType = filterType === "ALL" || p.type === filterType;
    const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.key && p.key.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (formData: ProductFormData) => {
    try {
      if (editingProduct) {
        const updated = await updateProductAction(editingProduct.id, formData);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
        notify(`✅ Producto "${updated.title}" actualizado con éxito.`);
      } else {
        const created = await createProductAction(formData);
        setProducts((prev) => [created, ...prev]);
        notify(`🚀 Producto "${created.title}" creado e ingresado a la base de datos.`);
      }
    } catch (err: any) {
      console.error(err);
      notify(`⚠️ Error al guardar producto: ${err.message || err}`);
    }
  };

  const handleToggleStatus = async (productId: string, currentStatus: ProductStatus) => {
    const nextStatus =
      currentStatus === ProductStatus.PUBLISHED ? ProductStatus.DRAFT : ProductStatus.PUBLISHED;

    try {
      const updated = await togglePublishProductAction(productId, nextStatus);
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, status: updated.status } : p)));
      notify(
        nextStatus === ProductStatus.PUBLISHED
          ? `🚀 ¡${updated.title} ahora está PUBLICADO en la tienda pública!`
          : `ℹ️ ${updated.title} ha cambiado a BORRADOR.`
      );
    } catch (err: any) {
      console.error(err);
      notify("⚠️ Error al cambiar el estado del producto.");
    }
  };

  const handleDeleteProduct = async (productId: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${title}"?`)) return;

    try {
      await deleteProductAction(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      notify(`🗑️ Producto "${title}" eliminado permanentemente.`);
    } catch (err: any) {
      console.error(err);
      notify("⚠️ Error al eliminar el producto.");
    }
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
        return { label: "BEAT / TRACK", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: Radio };
      case ProductType.BUNDLE:
        return { label: "BUNDLE", color: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: Layers };
      default:
        return { label: type, color: "bg-zinc-800 text-zinc-300 border-zinc-700", icon: Sparkles };
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-teal-400 text-zinc-950 font-mono font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce border border-teal-300">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-[#0d0f17] to-zinc-950 border border-zinc-800/80 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[11px] font-mono font-bold uppercase tracking-wider">
              GESTOR CENTRAL DE CATÁLOGO
            </span>
            <span className="text-zinc-500 text-xs font-mono">PostgreSQL Sync</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
            Catálogo Unificado de Productos
          </h1>
          <p className="text-xs md:text-sm text-zinc-400">
            Administra Cursos, Sample Packs, Loops, Beats y Bundles sincronizados en tiempo real con la tienda pública.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="h-11 sm:h-12 px-5 rounded-xl bg-teal-400 text-zinc-950 font-bold text-xs font-mono hover:bg-teal-300 transition-transform active:scale-95 shadow-glow flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Producto</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
        
        {/* Type Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { key: "ALL", label: "TODOS" },
            { key: ProductType.COURSE, label: "CURSOS" },
            { key: ProductType.SAMPLE_PACK, label: "SAMPLE PACKS" },
            { key: ProductType.LOOP, label: "LOOPS" },
            { key: ProductType.TRACK, label: "BEATS" },
            { key: ProductType.BUNDLE, label: "BUNDLES" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                filterType === tab.key
                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/40 shadow-glow font-bold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">🔍 ESTADO: TODOS</option>
            <option value={ProductStatus.PUBLISHED}>🟢 PUBLICADOS</option>
            <option value={ProductStatus.DRAFT}>🟡 BORRADORES</option>
            <option value={ProductStatus.ARCHIVED}>🔴 ARCHIVADOS</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar título, key, bpm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-teal-500 w-48 font-sans"
            />
          </div>

        </div>

      </div>

      {/* Catalog Grid / List */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
          <Music className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-zinc-400 text-sm font-mono">No se encontraron productos con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const typeInfo = getTypeBadge(product.type);
            const Icon = typeInfo.icon;
            const isPlayingThis = playingAudioUrl === product.previewAudioUrl;
            const isPublished = product.status === ProductStatus.PUBLISHED;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col rounded-2xl bg-[#0c0e17] border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all duration-300 shadow-xl"
              >
                
                {/* Product Thumbnail & Overlay Actions */}
                <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={product.thumbnailUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${typeInfo.color}`}>
                      <Icon className="w-3 h-3" />
                      <span>{typeInfo.label}</span>
                    </span>

                    <button
                      onClick={() => handleToggleStatus(product.id, product.status)}
                      className={`pointer-events-auto px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition-colors flex items-center gap-1 ${
                        isPublished
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                      }`}
                      title="Haz clic para alternar estado"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{isPublished ? "PUBLICADO" : "BORRADOR"}</span>
                    </button>
                  </div>

                  {/* Audio Preview Overlay Button */}
                  {product.previewAudioUrl && (
                    <button
                      onClick={() => handlePlayPreview(product.previewAudioUrl)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-teal-400 text-zinc-950 flex items-center justify-center shadow-glow hover:scale-110 transition-transform"
                      title="Preescuchar demo"
                    >
                      {isPlayingThis ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                    </button>
                  )}

                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-400 text-zinc-950 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>DESTACADO</span>
                    </div>
                  )}
                </div>

                {/* Body Details */}
                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>🏷️ {product.category}</span>
                      {product.fileSize && <span>📁 {product.fileSize}</span>}
                    </div>

                    <h3 className="font-bold text-base text-zinc-100 line-clamp-1 leading-snug">
                      {product.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      {product.description}
                    </p>

                    {/* Metadata Specs (BPM, Key, Format) */}
                    {(product.bpm || product.key || product.formatInfo) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {product.bpm && (
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-teal-300">
                            ⚡ {product.bpm} BPM
                          </span>
                        )}
                        {product.key && (
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-300">
                            🎵 {product.key}
                          </span>
                        )}
                        {product.formatInfo && (
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 truncate max-w-[200px]">
                            {product.formatInfo}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    
                    <div>
                      {product.salePrice ? (
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="text-base font-extrabold text-teal-400">${product.salePrice}</span>
                          <span className="text-xs text-zinc-500 line-through">${product.price}</span>
                        </div>
                      ) : (
                        <span className="text-base font-extrabold text-zinc-100 font-mono">${product.price}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      
                      {/* Special Course Builder Link for Courses */}
                      {product.type === ProductType.COURSE && (
                        <Link
                          href="/admin/courses/builder"
                          className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-colors"
                          title="Gestionar Módulos y Lecciones en Course Builder"
                        >
                          <Wrench className="w-4 h-4" />
                        </Link>
                      )}

                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
                        title="Editar producto"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id, product.title)}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Product Creation / Editing Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
      />

    </div>
  );
}
