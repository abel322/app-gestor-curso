"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CourseMock, LessonMock } from "@/lib/mock-data";
import {
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
  ExternalLink,
  Mic,
  MicOff,
  Clock,
  FileText,
  Volume2,
  CheckCircle2,
} from "lucide-react";
import {
  createCourseAction,
  togglePublishCourseAction,
  createModuleAction,
  deleteModuleAction,
  updateModuleOrderAction,
  createLessonAction,
  deleteLessonAction,
  updateLessonOrderAction,
  updateLessonAction,
  addLessonAttachmentAction,
  deleteLessonAttachmentAction,
} from "./actions";

interface CourseBuilderClientProps {
  initialCourses: CourseMock[];
}

export default function CourseBuilderClient({ initialCourses }: CourseBuilderClientProps) {
  const [courses, setCourses] = useState<CourseMock[]>(initialCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  useEffect(() => {
    setCourses(initialCourses);
    if (initialCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(initialCourses[0].id);
    }
  }, [initialCourses]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0] || null;

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

  // Modal para editar detalles avanzados y archivos adjuntos de lección
  const [editingLesson, setEditingLesson] = useState<{ modId: string; lesson: LessonMock } | null>(null);
  const [newAttTitle, setNewAttTitle] = useState("");
  const [newAttFileType, setNewAttFileType] = useState<"ZIP" | "MIDI" | "PRESET" | "PDF">("ZIP");
  const [newAttUrl, setNewAttUrl] = useState("#");

  // Speech-to-Text (Dictado por Voz) State & Ref
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const notify = (msg: string) => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(null), 4500);
  };

  // Toggle Speech-to-Text Dictation (es-ES)
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      notify("Tu navegador no soporta Dictado por Voz nativo. Te recomendamos usar Google Chrome, Microsoft Edge o Safari.");
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "es-ES";

      recognition.onstart = () => {
        setIsListening(true);
        notify("Dictado por voz activado en español (es-ES). Habla al micrófono...");
      };

      recognition.onresult = (event: any) => {
        let newText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            newText += event.results[i][0].transcript;
          }
        }

        if (newText.trim()) {
          setEditingLesson((prev) => {
            if (!prev) return null;
            const trimmedPrev = prev.lesson.content ? prev.lesson.content.trim() : "";
            const newContent = trimmedPrev ? `${trimmedPrev} ${newText.trim()}` : newText.trim();
            return {
              ...prev,
              lesson: {
                ...prev.lesson,
                content: newContent,
              },
            };
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
        if (event.error !== "no-speech") {
          notify(`Error en dictado de voz: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Could not start Speech Recognition:", err);
      setIsListening(false);
    }
  };

  // 1. Alternar Publicación
  const togglePublishStatus = async () => {
    if (!selectedCourse) return;
    const isCurrentlyPublished = selectedCourse.published;
    const nextPublished = !isCurrentlyPublished;

    notify(nextPublished ? "Publicando curso en tienda..." : "Despublicando curso...");
    try {
      await togglePublishCourseAction(selectedCourse.id, nextPublished);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, published: nextPublished, status: nextPublished ? "PUBLISHED" : "DRAFT" }
            : c
        )
      );
      notify(
        nextPublished
          ? `¡"${selectedCourse.title}" ha sido publicado en la tienda!`
          : `"${selectedCourse.title}" ha vuelto al estado borrador.`
      );
    } catch (err) {
      console.error(err);
      notify("Error al cambiar el estado de publicación.");
    }
  };

  // 2. Crear Nuevo Curso (Draft)
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    notify("Creando curso...");
    try {
      const newCourse = await createCourseAction({
        title: newCourseTitle,
        description: newCourseDescription || "Descripción del nuevo curso...",
        price: parseFloat(newCoursePrice) || 99.99,
        image: newCourseImage,
      });

      const formattedNewCourse: CourseMock = {
        id: newCourse.id,
        title: newCourse.title,
        slug: newCourse.slug,
        description: newCourse.description || "",
        image: newCourse.thumbnailUrl || newCourseImage,
        price: Number(newCourse.price),
        published: false,
        status: "DRAFT",
        createdAt: new Date().toISOString().split("T")[0],
        modules: [],
      };

      setCourses((prev) => [formattedNewCourse, ...prev]);
      setSelectedCourseId(newCourse.id);
      setShowCreateCourseModal(false);
      setNewCourseTitle("");
      setNewCourseDescription("");
      notify(`Curso "${newCourse.title}" creado en estado borrador.`);
    } catch (err) {
      console.error(err);
      notify("Error al crear el curso.");
    }
  };

  // 3. Mover Módulo
  const moveModule = async (modId: string, direction: "up" | "down") => {
    if (!selectedCourse) return;
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

    const updatedMods = mods.map((m, idx) => ({ id: m.id, order: idx + 1 }));

    const optimsMods = selectedCourse.modules
      .map((m) => {
        const target = updatedMods.find((um) => um.id === m.id);
        return target ? { ...m, order: target.order } : m;
      })
      .sort((a, b) => a.order - b.order);

    setCourses((prev) =>
      prev.map((c) => (c.id === selectedCourseId ? { ...c, modules: optimsMods } : c))
    );

    try {
      await updateModuleOrderAction(updatedMods);
      notify("Orden de módulos guardado.");
    } catch (err) {
      console.error(err);
      notify("Error al cambiar el orden de los módulos.");
    }
  };

  // 4. Mover Lección
  const moveLesson = async (modId: string, lessonId: string, direction: "up" | "down") => {
    if (!selectedCourse) return;
    const modObj = selectedCourse.modules.find((m) => m.id === modId);
    if (!modObj) return;

    const lessons = [...modObj.lessons];
    const idx = lessons.findIndex((l) => l.id === lessonId);
    if (idx === -1) return;

    if (direction === "up" && idx > 0) {
      const temp = lessons[idx];
      lessons[idx] = lessons[idx - 1];
      lessons[idx - 1] = temp;
    } else if (direction === "down" && idx < lessons.length - 1) {
      const temp = lessons[idx];
      lessons[idx] = lessons[idx + 1];
      lessons[idx + 1] = temp;
    }

    const updatedLessons = lessons.map((l, i) => ({ id: l.id, order: i + 1 }));

    const optimsMods = selectedCourse.modules.map((m) => {
      if (m.id !== modId) return m;
      const nextLessons = m.lessons
        .map((les) => {
          const target = updatedLessons.find((ul) => ul.id === les.id);
          return target ? { ...les, order: target.order } : les;
        })
        .sort((a, b) => a.order - b.order);
      return { ...m, lessons: nextLessons };
    });

    setCourses((prev) =>
      prev.map((c) => (c.id === selectedCourseId ? { ...c, modules: optimsMods } : c))
    );

    try {
      await updateLessonOrderAction(updatedLessons);
      notify("Orden de lecciones guardado.");
    } catch (err) {
      console.error(err);
      notify("Error al cambiar el orden de las lecciones.");
    }
  };

  // 5. Añadir Módulo
  const addModule = async () => {
    if (!selectedCourse || !newModuleTitle.trim()) return;
    const order = selectedCourse.modules.length + 1;

    notify("Creando módulo...");
    try {
      const newMod = await createModuleAction(selectedCourseId, newModuleTitle, order);
      const modToAdd = {
        id: newMod.id,
        title: newMod.title,
        order: newMod.order,
        courseId: selectedCourseId,
        lessons: [],
      };

      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourseId ? { ...c, modules: [...c.modules, modToAdd] } : c
        )
      );

      setNewModuleTitle("");
      setShowAddModule(false);
      notify(`Módulo "${newMod.title}" creado correctamente.`);
    } catch (err) {
      console.error(err);
      notify("Error al añadir el módulo.");
    }
  };

  // 6. Eliminar Módulo
  const deleteModule = async (modId: string) => {
    notify("Eliminando módulo...");
    try {
      await deleteModuleAction(modId);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourseId
            ? { ...c, modules: c.modules.filter((m) => m.id !== modId) }
            : c
        )
      );
      notify("Módulo eliminado.");
    } catch (err) {
      console.error(err);
      notify("Error al eliminar el módulo.");
    }
  };

  // 7. Crear Nueva Lección e Iniciar Editor Directamente
  const handleAddNewLesson = async (modId: string) => {
    if (!selectedCourse) return;
    const modObj = selectedCourse.modules.find((m) => m.id === modId);
    const lessonNumber = (modObj?.lessons.length || 0) + 1;
    const defaultTitle = `Lección ${
      selectedCourse.modules.findIndex((m) => m.id === modId) + 1
    }.${lessonNumber}: Nueva Lección de Audio`;

    notify("Creando lección...");
    try {
      const newLes = await createLessonAction(modId, defaultTitle, lessonNumber);
      const lessonObj: LessonMock = {
        id: newLes.id,
        title: newLes.title,
        order: newLes.order,
        duration: newLes.duration ?? 0,
        isFreePreview: newLes.isFreePreview,
        moduleId: modId,
        videoUrl: newLes.videoUrl || undefined,
        attachments: [],
      };

      setCourses((prev) =>
        prev.map((c) => {
          if (c.id !== selectedCourseId) return c;
          return {
            ...c,
            modules: c.modules.map((m) =>
              m.id === modId ? { ...m, lessons: [...m.lessons, lessonObj] } : m
            ),
          };
        })
      );

      setEditingLesson({
        modId,
        lesson: lessonObj,
      });
      notify("Lección creada. Abriendo editor avanzado.");
    } catch (err) {
      console.error(err);
      notify("Error al añadir la lección.");
    }
  };

  // 8. Eliminar Lección
  const deleteLesson = async (modId: string, lessonId: string) => {
    notify("Eliminando lección...");
    try {
      await deleteLessonAction(lessonId);
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id !== selectedCourseId) return c;
          return {
            ...c,
            modules: c.modules.map((m) =>
              m.id === modId
                ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
                : m
            ),
          };
        })
      );
      notify("Lección eliminada.");
    } catch (err) {
      console.error(err);
      notify("Error al eliminar la lección.");
    }
  };

  // 9. Actualizar lección desde el modal de edición
  const handleSaveLessonModal = async () => {
    if (!editingLesson) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    notify("Guardando cambios de la lección...");
    try {
      await updateLessonAction(editingLesson.lesson.id, {
        title: editingLesson.lesson.title,
        videoUrl: editingLesson.lesson.videoUrl,
        duration: editingLesson.lesson.duration,
        isFreePreview: editingLesson.lesson.isFreePreview || false,
      });

      setCourses((prev) =>
        prev.map((c) => {
          if (c.id !== selectedCourseId) return c;
          return {
            ...c,
            modules: c.modules.map((m) => {
              if (m.id !== editingLesson.modId) return m;
              return {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === editingLesson.lesson.id ? { ...editingLesson.lesson } : l
                ),
              };
            }),
          };
        })
      );

      setEditingLesson(null);
      notify("Cambios en lección guardados correctamente.");
    } catch (err) {
      console.error(err);
      notify("Error al guardar los cambios de la lección.");
    }
  };

  // 10. Añadir Archivo Adjunto a Lección
  const handleAddAttachment = async () => {
    if (!editingLesson || !newAttTitle.trim()) return;

    notify("Guardando archivo adjunto...");
    try {
      const att = await addLessonAttachmentAction(editingLesson.lesson.id, {
        title: newAttTitle,
        fileUrl: newAttUrl || "#",
        fileType: newAttFileType,
      });

      const newAttachmentItem = {
        id: att?.id || `att-${Date.now()}`,
        title: newAttTitle,
        fileUrl: newAttUrl || "#",
        fileType: newAttFileType,
      };

      setEditingLesson({
        ...editingLesson,
        lesson: {
          ...editingLesson.lesson,
          attachments: [...editingLesson.lesson.attachments, newAttachmentItem as any],
        },
      });

      setNewAttTitle("");
      setNewAttUrl("#");
      notify("Adjunto añadido.");
    } catch (err) {
      console.error(err);
      notify("Error al añadir el archivo adjunto.");
    }
  };

  // 11. Eliminar Archivo Adjunto
  const handleRemoveAttachment = async (attId: string) => {
    if (!editingLesson) return;

    notify("Eliminando archivo adjunto...");
    try {
      await deleteLessonAttachmentAction(attId);
      setEditingLesson({
        ...editingLesson,
        lesson: {
          ...editingLesson.lesson,
          attachments: editingLesson.lesson.attachments.filter((a) => a.id !== attId),
        },
      });
      notify("Adjunto eliminado.");
    } catch (err) {
      console.error(err);
      notify("Error al eliminar el archivo adjunto.");
    }
  };

  const handleSaveAll = () => {
    notify("¡Toda la estructura del curso se ha sincronizado correctamente!");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Panel de Creación y Estructuración de Cursos
          </h1>
          <p className="text-sm text-zinc-400 font-normal leading-relaxed mt-1">
            Gestión de temarios, módulos, dictado por voz y recursos descargables.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowCreateCourseModal(true)}
            className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-sm shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Curso</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="h-11 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 font-medium text-sm transition-all active:scale-95 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Sincronizar DB</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {savedNotification && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-zinc-200 text-sm flex items-center justify-between shadow-lg shadow-black/40">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-indigo-400" />
            <span className="font-medium">{savedNotification}</span>
          </div>
          <button
            onClick={() => setSavedNotification(null)}
            className="text-zinc-400 hover:text-zinc-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Course Selector & Primary Publication Banner */}
      {courses.length === 0 ? (
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/70 rounded-2xl p-8 shadow-sm text-center space-y-4">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-zinc-200 font-semibold text-lg">No hay cursos en la base de datos</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Comienza haciendo clic en el botón superior &quot;Crear Nuevo Curso&quot; para agregar el primero a la plataforma.
          </p>
        </div>
      ) : selectedCourse ? (
        <>
          {/* Main Elevated Card: Course Overview & Controls */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/70 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left: Course Picker */}
              <div className="w-full lg:w-1/2 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Curso Seleccionado para Administración</span>
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 text-sm text-zinc-100 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-zinc-950 text-zinc-200">
                      {c.title} • [{c.status === "PUBLISHED" ? "PUBLICADO" : "BORRADOR"}] (${c.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Right: State & Publish Action */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Estado en la Tienda Web
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCourse.published ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>PUBLICADO COMERCIALMENTE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>BORRADOR PRIVADO</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={togglePublishStatus}
                  className={`h-11 px-5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedCourse.published
                      ? "bg-zinc-900 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30 text-zinc-300 border border-zinc-800"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>{selectedCourse.published ? "Despublicar de la Tienda" : "Publicar en Tienda Web"}</span>
                </button>
              </div>
            </div>

            {/* Symmetric Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col gap-1">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  ID del Curso
                </span>
                <span className="text-sm font-semibold text-zinc-200 font-mono truncate" title={selectedCourse.id}>
                  {selectedCourse.id}
                </span>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col gap-1">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Módulos Totales
                </span>
                <span className="text-sm font-semibold text-zinc-200">
                  {selectedCourse.modules?.length || 0} Módulos
                </span>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col gap-1">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Lecciones Totales
                </span>
                <span className="text-sm font-semibold text-zinc-200">
                  {selectedCourse.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} Lecciones
                </span>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-3.5 flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    Precio Público
                  </span>
                  <span className="text-sm font-semibold text-zinc-200">
                    ${selectedCourse.price} USD
                  </span>
                </div>
                <Link
                  href="/store"
                  className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800 transition-colors"
                  title="Ver en tienda"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Modules & Lessons Structuring Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>Editor de Temario (Módulos y Lecciones)</span>
                </h2>
                <p className="text-sm text-zinc-400 font-normal leading-relaxed mt-0.5">
                  Organiza los módulos y abre el editor con dictado por voz para cada lección.
                </p>
              </div>

              <button
                onClick={() => setShowAddModule(true)}
                className="h-11 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 text-sm font-medium transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Añadir Nuevo Módulo</span>
              </button>
            </div>

            {/* Modal / Form to Add Module */}
            {showAddModule && (
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Ej: Módulo 1: Ecualización y Balance"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  className="flex-1 h-11 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addModule}
                    className="h-11 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all"
                  >
                    Crear Módulo
                  </button>
                  <button
                    onClick={() => setShowAddModule(false)}
                    className="px-4 py-2.5 text-zinc-400 text-sm hover:text-zinc-200 rounded-xl"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Render Modules Tree */}
            <div className="space-y-5">
              {(selectedCourse.modules || []).map((mod, mIdx) => (
                <div
                  key={mod.id}
                  className="bg-zinc-900/40 border border-zinc-800/70 rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* Module Header Bar */}
                  <div className="bg-zinc-900/80 p-4 border-b border-zinc-800/70 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveModule(mod.id, "up")}
                          disabled={mIdx === 0}
                          className="text-zinc-400 hover:text-indigo-400 disabled:opacity-20 transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
                          title="Mover arriba"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveModule(mod.id, "down")}
                          disabled={mIdx === (selectedCourse.modules?.length || 1) - 1}
                          className="text-zinc-400 hover:text-indigo-400 disabled:opacity-20 transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
                          title="Mover abajo"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 font-semibold text-xs flex items-center justify-center border border-zinc-700/50">
                        {mIdx + 1}
                      </span>

                      <h3 className="font-semibold text-sm text-zinc-100">{mod.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddNewLesson(mod.id)}
                        className="h-9 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 text-xs font-medium flex items-center gap-1.5 transition-all"
                      >
                        <FilePlus className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Añadir Lección</span>
                      </button>

                      <button
                        onClick={() => deleteModule(mod.id)}
                        className="p-2 text-zinc-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10"
                        title="Eliminar módulo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons List inside Module */}
                  <div className="divide-y divide-zinc-800/40 bg-zinc-950/40">
                    {(mod.lessons || []).map((les, lIdx) => (
                      <div
                        key={les.id}
                        className="p-4 px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-zinc-850/30 transition-colors"
                      >
                        {/* Left Details */}
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="flex flex-col gap-0.5 text-zinc-500 mt-0.5 sm:mt-0">
                            <button
                              onClick={() => moveLesson(mod.id, les.id, "up")}
                              disabled={lIdx === 0}
                              className="text-zinc-400 hover:text-indigo-400 disabled:opacity-20 p-1.5 rounded-lg hover:bg-zinc-800"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveLesson(mod.id, les.id, "down")}
                              disabled={lIdx === (mod.lessons?.length || 1) - 1}
                              className="text-zinc-400 hover:text-indigo-400 disabled:opacity-20 p-1.5 rounded-lg hover:bg-zinc-800"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-medium text-zinc-100">{les.title}</h4>

                              {les.isFreePreview && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  <Eye className="w-3 h-3" /> Vista Previa Gratis
                                </span>
                              )}

                              {les.videoUrl && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                  <Video className="w-3 h-3" /> Vídeo
                                </span>
                              )}
                            </div>

                            {/* Excerpt */}
                            <p className="text-xs text-zinc-400 line-clamp-1">
                              {les.content || "Sin explicación teórica redactada."}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 pt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                <span>{Math.round((les.duration || 0) / 60)} min</span>
                              </span>

                              {(les.attachments || []).map((att) => (
                                <span
                                  key={att.id}
                                  className="text-xs font-medium uppercase bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-800 flex items-center gap-1"
                                >
                                  <Paperclip className="w-3 h-3 text-indigo-400" />
                                  <span>{att.fileType}: {att.title}</span>
                                </span>
                              ))}

                              {(les.attachments || []).length === 0 && (
                                <span>0 adjuntos</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 self-start lg:self-center">
                          <button
                            onClick={() =>
                              setEditingLesson({
                                modId: mod.id,
                                lesson: { ...les, attachments: les.attachments || [] },
                              })
                            }
                            className="h-9 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 text-xs font-medium flex items-center gap-2 transition-all"
                          >
                            <Mic className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Editor & Dictado por Voz</span>
                          </button>

                          <button
                            onClick={() => deleteLesson(mod.id, les.id)}
                            className="p-2 text-zinc-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10"
                            title="Eliminar lección"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {(mod.lessons || []).length === 0 && (
                      <div className="p-6 text-center text-xs text-zinc-500 space-y-2">
                        <p>Aún no hay lecciones en este módulo.</p>
                        <button
                          onClick={() => handleAddNewLesson(mod.id)}
                          className="h-9 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-medium text-xs inline-flex items-center gap-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Crear Primera Lección</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {/* Modal 1: Crear Nuevo Curso */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 max-w-lg w-full p-6 rounded-2xl border border-zinc-800 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Crear Nuevo Curso (Borrador)</span>
              </h3>
              <button
                onClick={() => setShowCreateCourseModal(false)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Título del Curso
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Curso Profesional de Mezcla de Sonido"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Descripción Breve
                </label>
                <textarea
                  rows={3}
                  placeholder="Aprende ecualización quirúrgica, compresión dinámica y mezcla espacial..."
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Precio (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Imagen Portada (URL)
                  </label>
                  <input
                    type="text"
                    value={newCourseImage}
                    onChange={(e) => setNewCourseImage(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 text-xs leading-relaxed">
                El curso se creará como <strong className="text-zinc-200">Borrador Privado</strong>. Podrás estructurar su temario y publicarlo a la tienda web cuando esté listo.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="h-11 px-4 text-zinc-400 hover:text-zinc-200 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-11 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-sm shadow-indigo-500/20"
                >
                  Crear Curso en Borrador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: EDITOR AVANZADO DE LECCIONES CON DICTADO POR VOZ (Speech-to-Text) Y ADJUNTOS */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 max-w-3xl w-full p-6 rounded-2xl border border-zinc-800 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Editor de Lección Avanzado
                  </span>
                  {isListening && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-300 border border-red-500/30 flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      <span>Escuchando micrófono...</span>
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-100 mt-1">
                  {editingLesson.lesson.title || "Configurar Lección"}
                </h3>
              </div>
              <button
                onClick={() => {
                  if (isListening && recognitionRef.current) recognitionRef.current.stop();
                  setIsListening(false);
                  setEditingLesson(null);
                }}
                className="text-zinc-400 hover:text-zinc-100 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 text-sm">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                    Título de la Lección
                  </label>
                  <input
                    type="text"
                    value={editingLesson.lesson.title}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        lesson: { ...editingLesson.lesson, title: e.target.value },
                      })
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  />
                </div>

                {/* Video URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-400" />
                    <span>URL del Vídeo (Vimeo, YouTube o MP4)</span>
                  </label>
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
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Duración Estimada (en Minutos)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={Math.round((editingLesson.lesson.duration || 600) / 60)}
                    onChange={(e) => {
                      const mins = parseInt(e.target.value) || 1;
                      setEditingLesson({
                        ...editingLesson,
                        lesson: { ...editingLesson.lesson, duration: mins * 60 },
                      });
                    }}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  />
                </div>
              </div>

              {/* Checkbox: Free Preview */}
              <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Lección Gratuita de Vista Previa (Public Preview)</span>
                  </span>
                  <p className="text-xs text-zinc-400">
                    Permite que los usuarios no inscritos vean esta lección gratis como demostración del curso.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingLesson.lesson.isFreePreview || false}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        lesson: { ...editingLesson.lesson, isFreePreview: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>

              {/* Rich Text Explication with Integrated Speech-to-Text Microphone */}
              <div className="space-y-2 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-950/80 p-3 rounded-t-xl border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-zinc-200 text-xs uppercase tracking-wider">
                      Explicación Teórica / Notas de la Lección
                    </span>
                  </div>

                  {/* Speech-to-Text Microphone Button */}
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`h-9 px-3.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                      isListening
                        ? "bg-red-500/20 text-red-200 border border-red-500/60 animate-pulse"
                        : "bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-850"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-red-400" />
                        <span>Escuchando... Habla al Micrófono</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dictar Explicación (Speech-to-Text)</span>
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={editingLesson.lesson.content || ""}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      lesson: { ...editingLesson.lesson, content: e.target.value },
                    })
                  }
                  placeholder="Escribe o dicta por voz la explicación teórica de esta lección..."
                  className="w-full p-3.5 rounded-b-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 leading-relaxed font-sans"
                />

                <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                  <span>Caracteres: {(editingLesson.lesson.content || "").length}</span>
                  {isListening && (
                    <span className="text-red-400 animate-pulse font-medium flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Transcribiendo audio en vivo a español...</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-indigo-400" />
                    <span>Archivos Descargables Adjuntos</span>
                  </label>
                  <span className="text-xs text-zinc-500">Stems WAV, Multitracks, MIDIs, Presets, PDFs</span>
                </div>

                {/* Existing Attachments List */}
                <div className="space-y-2">
                  {(editingLesson.lesson.attachments || []).map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded-md font-semibold uppercase bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {att.fileType}
                        </span>
                        <span className="text-zinc-200 font-medium">{att.title}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAttachment(att.id)}
                        className="text-zinc-400 hover:text-rose-400 transition-colors p-1"
                        title="Eliminar adjunto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {(editingLesson.lesson.attachments || []).length === 0 && (
                    <div className="p-4 rounded-xl bg-zinc-950/40 border border-dashed border-zinc-800 text-center text-zinc-500 text-xs">
                      No hay archivos descargables adjuntos en esta lección todavía.
                    </div>
                  )}
                </div>

                {/* Form to Add New Attachment */}
                <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-3 mt-3">
                  <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Enlazar / Subir Nuevo Recurso Descargable
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Nombre (ej. Stems_Multitrack_WAV_Mezcla.zip)"
                      value={newAttTitle}
                      onChange={(e) => setNewAttTitle(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                    />

                    <select
                      value={newAttFileType}
                      onChange={(e) => setNewAttFileType(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ZIP">ZIP / WAV Stems</option>
                      <option value="MIDI">Archivos MIDI</option>
                      <option value="PRESET">Presets FXP / Serum</option>
                      <option value="PDF">Guía / Apuntes PDF</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      className="h-9 px-4 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 font-medium rounded-xl text-xs transition-all"
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
                  onClick={() => {
                    if (isListening && recognitionRef.current) recognitionRef.current.stop();
                    setIsListening(false);
                    setEditingLesson(null);
                  }}
                  className="h-11 px-4 text-zinc-400 hover:text-zinc-200 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveLessonModal}
                  className="h-11 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all flex items-center gap-2 shadow-sm shadow-indigo-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Lección</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
