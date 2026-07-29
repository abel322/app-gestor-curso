"use client";

import React, { useState } from "react";
import { INITIAL_COURSES, CourseMock, ModuleMock, LessonMock } from "@/lib/mock-data";
import { motion, Reorder } from "framer-motion";
import { 
  Wrench, 
  Plus, 
  GripVertical, 
  Trash2, 
  Edit3, 
  Check, 
  FilePlus, 
  Paperclip, 
  Sparkles, 
  Layers, 
  Save, 
  ArrowUp, 
  ArrowDown,
  Globe,
  Clock,
  Eye
} from "lucide-react";

export default function CourseBuilderPage() {
  const [courses, setCourses] = useState<CourseMock[]>(INITIAL_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(INITIAL_COURSES[0].id);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const [courseStatus, setCourseStatus] = useState<'DRAFT' | 'PUBLISHED' | 'DRIP_SCHEDULED'>(
    selectedCourse.status
  );

  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  // New Module modal state
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [showAddModule, setShowAddModule] = useState(false);

  // New Lesson state per module
  const [addingLessonModId, setAddingLessonModId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  const handleStatusChange = (status: 'DRAFT' | 'PUBLISHED' | 'DRIP_SCHEDULED') => {
    setCourseStatus(status);
    setCourses((prev) =>
      prev.map((c) => (c.id === selectedCourseId ? { ...c, status, published: status === "PUBLISHED" } : c))
    );
  };

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

    // re-assign orders
    mods.forEach((m, idx) => (m.order = idx + 1));

    updateSelectedCourseModules(mods);
  };

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
  };

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
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        content: "New lesson instructions and synth parameters.",
        attachments: [],
      };
      return { ...m, lessons: [...m.lessons, newLes] };
    });

    updateSelectedCourseModules(mods);
    setNewLessonTitle("");
    setAddingLessonModId(null);
  };

  const deleteLesson = (modId: string, lessonId: string) => {
    const mods = selectedCourse.modules.map((m) => {
      if (m.id !== modId) return m;
      return { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) };
    });
    updateSelectedCourseModules(mods);
  };

  const updateSelectedCourseModules = (modules: ModuleMock[]) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === selectedCourseId ? { ...c, modules } : c))
    );
  };

  const handleSaveAll = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>MODULE & LESSON BUILDER ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Interactive Course Content Builder
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Drag, rank, reorder modules and lessons. Manage attachment assets and publishing release schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-teal-400 text-zinc-950 font-bold text-xs hover:bg-teal-300 transition-transform active:scale-95 flex items-center gap-2 shadow-glow"
          >
            <Save className="w-4 h-4" />
            <span>Save Course Structure</span>
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-glow">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Course modules & rank order updated successfully in Prisma database state!</span>
        </div>
      )}

      {/* Select Course & Publishing Controls */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-800/80">
        
        {/* Course Dropdown */}
        <div className="w-full md:w-1/2 space-y-1">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Select Course to Edit</label>
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              const found = courses.find((c) => c.id === e.target.value);
              if (found) setCourseStatus(found.status);
            }}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm font-semibold focus:outline-none focus:border-teal-500/60"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} (${c.price})
              </option>
            ))}
          </select>
        </div>

        {/* Publishing Status Flag Controls */}
        <div className="w-full md:w-auto space-y-1">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Publishing Status Flag</label>
          <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
            {(["DRAFT", "PUBLISHED", "DRIP_SCHEDULED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  courseStatus === status
                    ? status === "PUBLISHED"
                      ? "bg-teal-400 text-zinc-950 shadow-glow"
                      : status === "DRAFT"
                      ? "bg-amber-500 text-zinc-950"
                      : "bg-purple-500 text-zinc-100 shadow-glow-purple"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Modules Tree & Lesson List Builder */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <span>Modules & Lesson Structure</span>
          </h2>

          <button
            onClick={() => setShowAddModule(true)}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-teal-300 text-xs font-semibold hover:border-teal-500/60 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Add New Module</span>
          </button>
        </div>

        {showAddModule && (
          <div className="glass-card p-4 rounded-xl flex gap-3 border border-teal-500/40">
            <input
              type="text"
              placeholder="Module Title (e.g. Module 3: Advanced LFO Waveform Shaping)"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={addModule}
              className="px-4 py-2 bg-teal-400 text-zinc-950 font-bold text-xs rounded-lg hover:bg-teal-300"
            >
              Create Module
            </button>
            <button
              onClick={() => setShowAddModule(false)}
              className="px-3 py-2 text-zinc-400 text-xs hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Tree Render */}
        <div className="space-y-4">
          {selectedCourse.modules.map((mod, mIdx) => (
            <div
              key={mod.id}
              className="glass-card rounded-2xl overflow-hidden border border-zinc-800/80 shadow-lg"
            >
              {/* Module Header Bar */}
              <div className="bg-zinc-900/90 p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveModule(mod.id, "up")}
                      disabled={mIdx === 0}
                      className="text-zinc-500 hover:text-teal-400 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveModule(mod.id, "down")}
                      disabled={mIdx === selectedCourse.modules.length - 1}
                      className="text-zinc-500 hover:text-teal-400 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono font-bold text-xs flex items-center justify-center">
                    {mIdx + 1}
                  </span>

                  <h3 className="font-bold text-sm text-zinc-100">{mod.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAddingLessonModId(mod.id)}
                    className="px-3 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-mono hover:bg-teal-500/20 flex items-center gap-1"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>+ Add Lesson</span>
                  </button>
                </div>
              </div>

              {/* Add Lesson inline form */}
              {addingLessonModId === mod.id && (
                <div className="p-3 bg-zinc-950/80 border-b border-zinc-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Lesson Title (e.g. 1.3 Sub-Bass Layering & Saturation)"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
                  />
                  <button
                    onClick={() => addLesson(mod.id)}
                    className="px-3 py-1.5 bg-teal-400 text-zinc-950 text-xs font-bold rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setAddingLessonModId(null)}
                    className="px-2 text-xs text-zinc-400"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Lessons List under module */}
              <div className="divide-y divide-zinc-800/40 bg-[#0d0f17]/40">
                {mod.lessons.map((les, lIdx) => (
                  <div
                    key={les.id}
                    className="p-3.5 px-6 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-zinc-500">
                        <button
                          onClick={() => moveLesson(mod.id, les.id, "up")}
                          disabled={lIdx === 0}
                          className="hover:text-teal-400 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveLesson(mod.id, les.id, "down")}
                          disabled={lIdx === mod.lessons.length - 1}
                          className="hover:text-teal-400 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-zinc-200">{les.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-zinc-500">
                            Duration: {Math.round(les.duration / 60)} min
                          </span>
                          {les.attachments.length > 0 && (
                            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 rounded">
                              📎 {les.attachments.length} attachment(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteLesson(mod.id, les.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
                {mod.lessons.length === 0 && (
                  <div className="p-4 text-center text-xs font-mono text-zinc-600">
                    No lessons created in this module yet. Click "+ Add Lesson".
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
