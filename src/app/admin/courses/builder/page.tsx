"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_COURSES, CourseMock, ModuleMock, LessonMock, LessonAttachmentMock } from "@/lib/mock-data";
import { 
  Wrench, 
  Plus, 
  Trash2, 
  Check, 
  FilePlus, 
  Layers, 
  Save, 
  ArrowUp, 
  ArrowDown,
  Globe,
  Video,
  Paperclip,
  X,
  Eye,
  BookOpen,
  Sparkles,
  Edit,
  ExternalLink
} from "lucide-react";

export default function CourseBuilderPage() {
  const [courses, setCourses] = useState<CourseMock[]>(INITIAL_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(INITIAL_COURSES[0].id);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const [courseStatus, setCourseStatus] = useState<'DRAFT' | 'PUBLISHED' | 'DRIP_SCHEDULED'>(
    selectedCourse.status
  );

  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Modal para crear nuevo curso
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCoursePrice, setNewCoursePrice] = useState("119.99");
  const [newCourseImage, setNewCourseImage] = useState(
    "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop"
  );

  // Form de nuevo módulo
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [showAddModule, setShowAddModule] = useState(false);

  // Form de lección inline
  const [addingLessonModId, setAddingLessonModId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");

  // Modal para editar detalles y archivos adjuntos de lección
  const [editingLesson, setEditingLesson] = useState<{ modId: string; lesson: LessonMock } | null>(null);
  const [newAttTitle, setNewAttTitle] = useState("");
  const [newAttFileType, setNewAttFileType] = useState<'ZIP' | 'MIDI' | 'PRESET' | 'PDF'>("ZIP");
  const [newAttUrl, setNewAttUrl] = useState("#");

  const notify = (msg: string) => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(null), 4000);
  };

  // 1. Alternar Publicación ("🚀 Publicar en Tienda Web")
  const togglePublishStatus = () => {
    const isCurrentlyPublished = selectedCourse.status === "PUBLISHED";
    const nextStatus = isCurrentlyPublished ? "DRAFT" : "PUBLISHED";
    const nextPublished = !isCurrentlyPublished;

    setCourseStatus(nextStatus);
    setCourses((prev) =>
      prev.map((c) =>
        c.id === selectedCourseId
          ? { ...c, status: nextStatus, published: nextPublished }
          : c
      )
    );

    if (nextPublished) {
      notify(`🚀 ¡"${selectedCourse.title}" ha sido PUBLICADO EN LA TIENDA WEB comercialmente!`);
    } else {
      notify(`ℹ️ "${selectedCourse.title}" ha vuelto al estado BORRADOR (no visible en tienda).`);
    }
  };

  // 2. Crear Nuevo Curso (Draft)
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newSlug = newCourseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newCourse: CourseMock = {
      id: `crs-${Date.now()}`,
      title: newCourseTitle,
      slug: newSlug,
      description: newCourseDescription || "Descripción del nuevo curso...",
      image: newCourseImage,
      price: parseFloat(newCoursePrice) || 99.99,
      published: false,
      status: "DRAFT",
      createdAt: new Date().toISOString().split("T")[0],
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          title: "Módulo 1: Introducción y Fundamentos",
          order: 1,
          courseId: `crs-${Date.now()}`,
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: "Lección 1.1: Descripción General",
              order: 1,
              duration: 600,
              moduleId: `mod-${Date.now()}-1`,
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              content: "Bienvenido al curso. Revisa los archivos adjuntos.",
              attachments: [],
            },
          ],
        },
      ],
    };

    setCourses([newCourse, ...courses]);
    setSelectedCourseId(newCourse.id);
    setCourseStatus("DRAFT");
    setShowCreateCourseModal(false);
    setNewCourseTitle("");
    setNewCourseDescription("");

    notify(`✅ Curso "${newCourse.title}" creado en estado BORRADOR. ¡Agrega módulos y lecciones!`);
  };

  // 3. Mover Módulo
  const moveModule = (modId: string, direction: "up" | "down") => {
    const mods = [...selectedCourse.modules];
    const index = mods.findIndex((m) => m.id === modId);
    if (index === -1) return;

    if (direction === "up" && index > 0) {
      const temp = mods[index];
      mods[index] = mods[index - 1];
      mods[index - 1] = temp;
    } else if (direction === "down" && index < mods.length - 1) {
      const temp = mods[index];
      mods[index] = mods[index + 1];
      mods[index + 1] = temp;
    }

    mods.forEach((m, idx) => (m.order = idx + 1));
    updateSelectedCourseModules(mods);
  };

  // 4. Mover Lección
  const moveLesson = (modId: string, lessonId: string, direction: "up" | "down") => {
    const mods = selectedCourse.modules.map((m) => {
      if (m.id !== modId) return m;
      const lessons = [...m.lessons];
      const idx = lessons.findIndex((l) => l.id === lessonId);
      if (idx === -1) return m;

      if (direction === "up" && idx > 0) {
        const temp = lessons[idx];
        lessons[idx] = lessons[idx - 1];
        lessons[idx - 1] = temp;
      } else if (direction === "down" && idx < lessons.length - 1) {
        const temp = lessons[idx];
        lessons[idx] = lessons[idx + 1];
        lessons[idx + 1] = temp;
      }
      lessons.forEach((l, i) => (l.order = i + 1));
      return { ...m, lessons };
    });

    updateSelectedCourseModules(mods);
  };

  // 5. Añadir Módulo
  const addModule = () => {
    if (!newModuleTitle.trim()) return;
    const newMod: ModuleMock = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle,
      order: selectedCourse.modules.length + 1,
      courseId: selectedCourseId,
      lessons: [],
    };
    updateSelectedCourseModules([...selectedCourse.modules, newMod]);
    setNewModuleTitle("");
    setShowAddModule(false);
    notify(`Módulo "${newModuleTitle}" creado correctamente.`);
  };

  // 6. Eliminar Módulo
  const deleteModule = (modId: string) => {
    const mods = selectedCourse.modules.filter((m) => m.id !== modId);
    updateSelectedCourseModules(mods);
    notify("Módulo eliminado.");
  };

  // 7. Añadir Lección
  const addLesson = (modId: string) => {
    if (!newLessonTitle.trim()) return;
    const mods = selectedCourse.modules.map((m) => {
      if (m.id !== modId) return m;
      const newLes: LessonMock = {
        id: `les-${Date.now()}`,
        title: newLessonTitle,
        order: m.lessons.length + 1,
        duration: 600,
        moduleId: modId,
        videoUrl: newLessonVideoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
        content: "Contenido y explicaciones detalladas de la lección.",
        attachments: [],
      };
      return { ...m, lessons: [...m.lessons, newLes] };
    });

    updateSelectedCourseModules(mods);
    setNewLessonTitle("");
    setAddingLessonModId(null);
    notify("Lección agregada exitosamente.");
  };

  // 8. Eliminar Lección
  const deleteLesson = (modId: string, lessonId: string) => {
    const mods = selectedCourse.modules.map((m) => {
      if (m.id !== modId) return m;
      return { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) };
    });
    updateSelectedCourseModules(mods);
    notify("Lección eliminada.");
  };

  // 9. Actualizar lección desde el modal de edición
  const handleSaveLessonModal = () => {
    if (!editingLesson) return;

    const mods = selectedCourse.modules.map((m) => {
      if (m.id !== editingLesson.modId) return m;
      const updatedLessons = m.lessons.map((l) =>
        l.id === editingLesson.lesson.id ? editingLesson.lesson : l
      );
      return { ...m, lessons: updatedLessons };
    });

    updateSelectedCourseModules(mods);
    setEditingLesson(null);
    notify("Detalles y adjuntos de lección actualizados.");
  };

  // 10. Añadir Archivo Adjunto a Lección
  const handleAddAttachment = () => {
    if (!editingLesson || !newAttTitle.trim()) return;

    const newAtt: LessonAttachmentMock = {
      id: `att-${Date.now()}`,
      title: newAttTitle,
      fileUrl: newAttUrl || "#",
      fileType: newAttFileType,
    };

    setEditingLesson({
      ...editingLesson,
      lesson: {
        ...editingLesson.lesson,
        attachments: [...editingLesson.lesson.attachments, newAtt],
      },
    });

    setNewAttTitle("");
    setNewAttUrl("#");
  };

  // 11. Eliminar Archivo Adjunto
  const handleRemoveAttachment = (attId: string) => {
    if (!editingLesson) return;
    setEditingLesson({
      ...editingLesson,
      lesson: {
        ...editingLesson.lesson,
        attachments: editingLesson.lesson.attachments.filter((a) => a.id !== attId),
      },
    });
  };

  const updateSelectedCourseModules = (modules: ModuleMock[]) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === selectedCourseId ? { ...c, modules } : c))
    );
  };

  const handleSaveAll = () => {
    notify("¡Toda la estructura del curso ha sido guardada en la base de datos local!");
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>LMS ADMIN STUDIO • CREATOR ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Panel de Creación y Estructuración de Cursos
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Diseña el temario por módulos y lecciones, adjunta recursos descargables (stems, MIDI, presets, PDFs) y controla la publicación en la tienda web.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateCourseModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-transform active:scale-95 flex items-center gap-2 shadow-glow-purple"
          >
            <Plus className="w-4 h-4" />
            <span>+ Crear Nuevo Curso</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="px-4 py-2.5 rounded-xl bg-teal-400 text-zinc-950 font-bold text-xs hover:bg-teal-300 transition-transform active:scale-95 flex items-center gap-2 shadow-glow"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {savedNotification && (
        <div className="bg-teal-500/15 border border-teal-500/40 p-4 rounded-xl text-teal-200 text-xs font-mono flex items-center justify-between shadow-glow">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-teal-400" />
            <span>{savedNotification}</span>
          </div>
          <button onClick={() => setSavedNotification(null)} className="text-zinc-400 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Course Selector & Primary Publication Banner */}
      <div className="glass-card rounded-2xl p-6 border border-zinc-800/80 space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Course Picker */}
          <div className="w-full lg:w-1/2 space-y-2">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Curso Seleccionado para Administración</span>
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                const found = courses.find((c) => c.id === e.target.value);
                if (found) setCourseStatus(found.status);
              }}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-bold focus:outline-none focus:border-teal-500/60 shadow-inner"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} • [{c.status === "PUBLISHED" ? "PUBLICADO EN TIENDA" : "BORRADOR / DRAFT"}] (${c.price})
                </option>
              ))}
            </select>
          </div>

          {/* Right: Primary Action "🚀 Publicar en Tienda Web" */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Estado en la Tienda</div>
              <div className="flex items-center gap-2 mt-1">
                {selectedCourse.published ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-glow">
                    <Globe className="w-3.5 h-3.5" />
                    <span>PUBLICADO COMERCIALMENTE</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>BORRADOR PRIVADO (DRAFT)</span>
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={togglePublishStatus}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs tracking-wider transition-all duration-200 flex items-center gap-2.5 shadow-xl ${
                selectedCourse.published
                  ? "bg-zinc-800 text-zinc-300 hover:bg-red-500/20 hover:text-red-300 border border-zinc-700 hover:border-red-500/40"
                  : "bg-gradient-to-r from-teal-400 to-cyan-400 text-zinc-950 hover:brightness-110 shadow-glow active:scale-95"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{selectedCourse.published ? "Despublicar de la Tienda" : "🚀 Publicar en Tienda Web"}</span>
            </button>
          </div>

        </div>

        {/* Selected Course Overview Card */}
        <div className="pt-4 border-t border-zinc-800/60 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block">ID del Curso</span>
            <span className="text-zinc-200 font-bold">{selectedCourse.id}</span>
          </div>
          <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block">Módulos Totales</span>
            <span className="text-teal-400 font-bold">{selectedCourse.modules.length} Módulos</span>
          </div>
          <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 block">Lecciones Totales</span>
            <span className="text-purple-400 font-bold">
              {selectedCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lecciones
            </span>
          </div>
          <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
            <div>
              <span className="text-zinc-500 block">Precio Público</span>
              <span className="text-zinc-100 font-bold">${selectedCourse.price} USD</span>
            </div>
            <Link
              href="/store"
              className="p-1.5 rounded-lg bg-zinc-900 text-teal-400 hover:bg-zinc-800 transition-colors"
              title="Ver en tienda"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Modules & Lessons Structuring Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <span>Editor de Temario (Módulos y Lecciones)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Organiza la secuencia de enseñanza del "{selectedCourse.title}".
            </p>
          </div>

          <button
            onClick={() => setShowAddModule(true)}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-teal-500/40 text-teal-300 text-xs font-bold hover:bg-teal-500/10 flex items-center gap-2 transition-all shadow-glow"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Añadir Nuevo Módulo</span>
          </button>
        </div>

        {/* Modal / Form to Add Module */}
        {showAddModule && (
          <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row gap-3 border border-teal-500/50 shadow-glow">
            <input
              type="text"
              placeholder="Ej: Módulo 1: Ecualización y Balance"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-teal-500"
            />
            <div className="flex gap-2">
              <button
                onClick={addModule}
                className="px-4 py-2.5 bg-teal-400 text-zinc-950 font-extrabold text-xs rounded-lg hover:bg-teal-300"
              >
                Crear Módulo
              </button>
              <button
                onClick={() => setShowAddModule(false)}
                className="px-3 py-2.5 text-zinc-400 text-xs hover:text-zinc-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Render Modules Tree */}
        <div className="space-y-6">
          {selectedCourse.modules.map((mod, mIdx) => (
            <div
              key={mod.id}
              className="glass-card rounded-2xl overflow-hidden border border-zinc-800/80 shadow-xl"
            >
              {/* Module Header Bar */}
              <div className="bg-zinc-900/90 p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveModule(mod.id, "up")}
                      disabled={mIdx === 0}
                      className="text-zinc-500 hover:text-teal-400 disabled:opacity-20 transition-colors"
                      title="Mover arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveModule(mod.id, "down")}
                      disabled={mIdx === selectedCourse.modules.length - 1}
                      className="text-zinc-500 hover:text-teal-400 disabled:opacity-20 transition-colors"
                      title="Mover abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono font-bold text-xs flex items-center justify-center">
                    {mIdx + 1}
                  </span>

                  <h3 className="font-extrabold text-sm text-zinc-100">{mod.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAddingLessonModId(mod.id)}
                    className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-mono hover:bg-teal-500/20 flex items-center gap-1.5 transition-colors"
                  >
                    <FilePlus className="w-3.5 h-3.5 text-teal-400" />
                    <span>+ Añadir Lección</span>
                  </button>

                  <button
                    onClick={() => deleteModule(mod.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Eliminar módulo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add Lesson Inline Form */}
              {addingLessonModId === mod.id && (
                <div className="p-4 bg-zinc-950/90 border-b border-zinc-800 space-y-3">
                  <div className="text-xs font-mono text-teal-400">Nueva Lección para "{mod.title}"</div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Título (ej: Lección 1.1: Limpieza de Frecuencias)"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-teal-500"
                    />
                    <input
                      type="text"
                      placeholder="Vídeo URL (YouTube / Vimeo)"
                      value={newLessonVideoUrl}
                      onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                      className="w-full sm:w-64 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-teal-500 font-mono"
                    />
                    <button
                      onClick={() => addLesson(mod.id)}
                      className="px-4 py-2 bg-teal-400 text-zinc-950 text-xs font-bold rounded-lg hover:bg-teal-300"
                    >
                      Guardar Lección
                    </button>
                    <button
                      onClick={() => setAddingLessonModId(null)}
                      className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Lessons List inside Module */}
              <div className="divide-y divide-zinc-800/40 bg-[#0d0f17]/60">
                {mod.lessons.map((les, lIdx) => (
                  <div
                    key={les.id}
                    className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-zinc-500">
                        <button
                          onClick={() => moveLesson(mod.id, les.id, "up")}
                          disabled={lIdx === 0}
                          className="hover:text-teal-400 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveLesson(mod.id, les.id, "down")}
                          disabled={lIdx === mod.lessons.length - 1}
                          className="hover:text-teal-400 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-zinc-100">{les.title}</h4>
                          {les.videoUrl && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                              <Video className="w-3 h-3" /> Vídeo
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400">
                          <span>Duración: {Math.round(les.duration / 60)} min</span>
                          {les.attachments.length > 0 ? (
                            <span className="text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
                              <Paperclip className="w-3 h-3 text-purple-400" />
                              <span>{les.attachments.length} archivo(s) adjunto(s) (Stems WAV, MIDI, Presets, PDF)</span>
                            </span>
                          ) : (
                            <span className="text-zinc-600">Sin archivos adjuntos</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setEditingLesson({ modId: mod.id, lesson: { ...les } })}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono hover:bg-zinc-700 flex items-center gap-1.5 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-teal-400" />
                        <span>Editar Adjuntos & Video</span>
                      </button>

                      <button
                        onClick={() => deleteLesson(mod.id, les.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Eliminar lección"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}

                {mod.lessons.length === 0 && (
                  <div className="p-6 text-center text-xs font-mono text-zinc-500 space-y-1">
                    <p>Aún no hay lecciones en este módulo.</p>
                    <button
                      onClick={() => setAddingLessonModId(mod.id)}
                      className="text-teal-400 hover:underline font-bold"
                    >
                      + Haz clic aquí para añadir la primera lección
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Crear Nuevo Curso */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-zinc-800 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-extrabold text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Crear Nuevo Curso (Estado: BORRADOR)</span>
              </h3>
              <button onClick={() => setShowCreateCourseModal(false)} className="text-zinc-400 hover:text-zinc-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400">Título del Curso</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Curso Profesional de Mezcla de Sonido"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Descripción Breve</label>
                <textarea
                  rows={3}
                  placeholder="Aprende ecualización quirúrgica, compresión dinámicas y mezcla espacial..."
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400">Precio Comercial (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">Imagen Portada (URL)</label>
                  <input
                    type="text"
                    value={newCourseImage}
                    onChange={(e) => setNewCourseImage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-300 text-[11px]">
                ℹ️ El curso se creará como <strong>BORRADOR (DRAFT)</strong> con `published: false`. Podrás estructurar su temario y publicarlo a la tienda web cuando esté listo.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-glow-purple"
                >
                  Crear Curso en Borrador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Editar Lección y Gestionar Archivos Adjuntos (WAV, MIDI, Presets, PDF) */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-6 rounded-2xl border border-zinc-800 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-zinc-100 flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-teal-400" />
                  <span>Editor de Lección y Recursos Adjuntos</span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">{editingLesson.lesson.title}</p>
              </div>
              <button onClick={() => setEditingLesson(null)} className="text-zinc-400 hover:text-zinc-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs font-mono">
              
              {/* Basic Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-zinc-400">Título de la Lección</label>
                  <input
                    type="text"
                    value={editingLesson.lesson.title}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        lesson: { ...editingLesson.lesson, title: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">Enlace a Vídeo de la Lección (YouTube / Vimeo / Direct URL)</label>
                  <input
                    type="text"
                    value={editingLesson.lesson.videoUrl || ""}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        lesson: { ...editingLesson.lesson, videoUrl: e.target.value },
                      })
                    }
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-teal-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-purple-400" />
                    <span>Archivos Descargables Adjuntos</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">Stems WAV, MIDI, Presets FXP, Guías PDF</span>
                </div>

                {/* Existing Attachments List */}
                <div className="space-y-2">
                  {editingLesson.lesson.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          {att.fileType}
                        </span>
                        <span className="text-zinc-200 font-semibold">{att.title}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAttachment(att.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                        title="Eliminar adjunto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {editingLesson.lesson.attachments.length === 0 && (
                    <div className="p-4 rounded-xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center text-zinc-500 text-xs">
                      No hay archivos adjuntos en esta lección todavía.
                    </div>
                  )}
                </div>

                {/* Form to Add New Attachment */}
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3 mt-3">
                  <div className="text-[11px] font-bold text-teal-400 uppercase">Añadir Nuevo Recurso Descargable</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Nombre del Recurso (ej. Stems_Multitrack_WAV.zip)"
                      value={newAttTitle}
                      onChange={(e) => setNewAttTitle(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs"
                    />
                    
                    <select
                      value={newAttFileType}
                      onChange={(e) => setNewAttFileType(e.target.value as any)}
                      className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-bold"
                    >
                      <option value="ZIP">ZIP / WAV Stems</option>
                      <option value="MIDI">Archivos MIDI</option>
                      <option value="PRESET">Presets Synth</option>
                      <option value="PDF">Guía PDF</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      className="px-4 py-2 bg-teal-400 text-zinc-950 font-bold rounded-lg hover:bg-teal-300 text-xs"
                    >
                      + Adjuntar Recurso
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 text-zinc-400 hover:text-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveLessonModal}
                  className="px-5 py-2.5 bg-teal-400 text-zinc-950 font-extrabold rounded-xl shadow-glow"
                >
                  Guardar Lección
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
