export interface UserMock {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STUDENT' | 'CUSTOMER';
  createdAt: string;
}

export interface LessonAttachmentMock {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'PDF' | 'MIDI' | 'PRESET' | 'ZIP';
}

export interface LessonMock {
  id: string;
  title: string;
  videoUrl?: string;
  content?: string;
  order: number;
  duration: number; // en segundos
  moduleId: string;
  attachments: LessonAttachmentMock[];
}

export interface ModuleMock {
  id: string;
  title: string;
  order: number;
  courseId: string;
  lessons: LessonMock[];
}

export interface CourseMock {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  published: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'DRIP_SCHEDULED';
  createdAt: string;
  modules: ModuleMock[];
}

export interface MusicProductMock {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  bpm?: number;
  key?: string;
  audioDemoUrl: string;
  downloadZipUrl: string;
  productType: 'BEAT' | 'SAMPLE_PACK' | 'PRESET' | 'MIDI';
  createdAt: string;
}

export interface CourseProgressMock {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface PurchaseMock {
  id: string;
  userId: string;
  productType: 'COURSE' | 'MUSIC_ASSET';
  referenceId: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  createdAt: string;
}

export const INITIAL_USERS: UserMock[] = [
  { id: "usr-1", name: "Alex Productor", email: "alex@productor.com", role: "ADMIN", createdAt: "2026-01-10" },
  { id: "usr-2", name: "Elena Rostova", email: "elena@beats.io", role: "STUDENT", createdAt: "2026-02-14" },
  { id: "usr-3", name: "Marcos Vance", email: "marcos@diseñodesonido.com", role: "STUDENT", createdAt: "2026-03-01" },
  { id: "usr-4", name: "David Kim", email: "dkim@musica.net", role: "STUDENT", createdAt: "2026-04-12" },
  { id: "usr-5", name: "Sara Connor", email: "sara@synthwave.org", role: "CUSTOMER", createdAt: "2026-05-19" },
];

export const INITIAL_COURSES: CourseMock[] = [
  {
    id: "crs-1",
    title: "Masterclass de Diseño de Sonido en Serum: Cyberpunk y Trap Moderno",
    slug: "masterclass-diseno-sonido-serum",
    description: "Domina la síntesis por tablas de ondas, ruteo avanzado de LFOs y diseño de bajos neón en Xfer Serum. Incluye más de 50 presets y stems de proyecto.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
    price: 99.99,
    published: true,
    status: "PUBLISHED",
    createdAt: "2026-01-15",
    modules: [
      {
        id: "mod-101",
        title: "Módulo 1: Síntesis de Tablas de Ondas y Osciladores Personalizados",
        order: 1,
        courseId: "crs-1",
        lessons: [
          {
            id: "les-1001",
            title: "1.1 Importación de Tablas de Ondas y Transiciones Suaves",
            order: 1,
            duration: 740,
            moduleId: "mod-101",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Aprende a importar formas de onda de audio puro en Xfer Serum y utilizar el editor 3D para suavizar los fotogramas de transición.",
            attachments: [
              { id: "att-1", title: "Pack_Tablas_Ondas_Cyberpunk.zip", fileUrl: "#", fileType: "ZIP" },
              { id: "att-2", title: "Guia_Leccion_1.pdf", fileUrl: "#", fileType: "PDF" },
            ],
          },
          {
            id: "les-1002",
            title: "1.2 Diseño de Bajos Reese Pesados y Modulación FM",
            order: 2,
            duration: 1120,
            moduleId: "mod-101",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Paso a paso para modulación FM desde Osc B hacia Osc A, ruteo de filtros divididos y saturación sub-armónica para líneas de bajo potentes.",
            attachments: [
              { id: "att-3", title: "Bajo_Reese_Preset_Serum.fxp", fileUrl: "#", fileType: "PRESET" },
            ],
          },
        ],
      },
      {
        id: "mod-102",
        title: "Módulo 2: Secuencias Avanzadas de LFO y Movimiento de Filtros",
        order: 2,
        courseId: "crs-1",
        lessons: [
          {
            id: "les-1003",
            title: "2.1 Creación de Acordes Vocales Rítmicos con Gate",
            order: 1,
            duration: 910,
            moduleId: "mod-102",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Uso del ajuste a la rejilla para diseñar patrones de LFO complejos para compresión sidechain sin plugins de terceros.",
            attachments: [
              { id: "att-4", title: "Progresion_Acordes.mid", fileUrl: "#", fileType: "MIDI" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "crs-2",
    title: "Producción Profesional de Afrobeat y Amapiano",
    slug: "produccion-pro-afrobeat-amapiano",
    description: "Aprende mezcla de Log Drums, cuantización de groove, marimbas melódicas y capas de percusión contagiosas de la mano de productores reconocidos.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    price: 129.99,
    published: true,
    status: "PUBLISHED",
    createdAt: "2026-02-01",
    modules: [
      {
        id: "mod-201",
        title: "Módulo 1: Ritmo, Percusión y Ciencia del Log Drum",
        order: 1,
        courseId: "crs-2",
        lessons: [
          {
            id: "les-2001",
            title: "1.1 Creación del Bajo Log Drum Característico del Amapiano",
            order: 1,
            duration: 850,
            moduleId: "mod-201",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Técnicas de deslizamiento de tono (pitch glide), modelado de envolventes y limpieza de frecuencias graves en mono para grandes sistemas de sonido.",
            attachments: [
              { id: "att-5", title: "Kit_Log_Drums_Amapiano.zip", fileUrl: "#", fileType: "ZIP" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "crs-3",
    title: "Mezcla y Masterización con Emulaciones Analógicas",
    slug: "mezcla-masterizacion-emulaciones-analogicas",
    description: "Transforma maquetas caseras en másters listos para plataformas utilizando canales SSL, saturación de cinta Neve y ecualización dinámica.",
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop",
    price: 149.99,
    published: false,
    status: "DRAFT",
    createdAt: "2026-03-10",
    modules: [
      {
        id: "mod-301",
        title: "Módulo 1: Estructura de Ganancia y Mezcla de Voces",
        order: 1,
        courseId: "crs-3",
        lessons: [
          {
            id: "les-3001",
            title: "1.1 De-Essing Vocal, Compresión y Amplitud Estéreo",
            order: 1,
            duration: 1200,
            moduleId: "mod-301",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Cómo abrir espacio para las voces principales en mezclas electrónicas densas.",
            attachments: [],
          },
        ],
      },
    ],
  },
];

export const INITIAL_MUSIC_PRODUCTS: MusicProductMock[] = [
  {
    id: "mp-1",
    title: "CYBERPUNK 2099 - Pack de Beats y Stems",
    slug: "cyberpunk-2099-beats-stems",
    description: "Stems de producción para synthwave, midtempo oscuro e industrial futurista con licencia comercial completa.",
    price: 34.99,
    bpm: 120,
    key: "Fa# Menor",
    audioDemoUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cyberpunk-beat-120bpm.mp3",
    downloadZipUrl: "#",
    productType: "BEAT",
    createdAt: "2026-01-20",
  },
  {
    id: "mp-2",
    title: "NEON SYNTHWAVE V1 - Presets para Serum",
    slug: "neon-synthwave-v1-serum",
    description: "64 Pads analógicos, arpegios retro, metales synth y plucks de los 80 ajustados para pop retro moderno.",
    price: 24.99,
    bpm: undefined,
    key: undefined,
    audioDemoUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a739f3.mp3?filename=synthwave-preview.mp3",
    downloadZipUrl: "#",
    productType: "PRESET",
    createdAt: "2026-02-05",
  },
  {
    id: "mp-3",
    title: "AFROGROOVE VOL. 3 - Percusión y Librería de Samples",
    slug: "afrogroove-vol-3-percusión",
    description: "Más de 450+ sonidos WAV a 24-bits, maracas, golpes de log drum, chops vocales dinámicos y bucles orgánicos.",
    price: 29.99,
    bpm: 112,
    key: "La Menor",
    audioDemoUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=afrobeats-loop.mp3",
    downloadZipUrl: "#",
    productType: "SAMPLE_PACK",
    createdAt: "2026-02-28",
  },
  {
    id: "mp-4",
    title: "CHORD MAESTRO - 100+ Kits de Progresiones MIDI Neo-Soul",
    slug: "chord-maestro-kits-midi",
    description: "Progresiones de acordes de 7ma, 9na y 11na en las 12 tonalidades. Acelera tu flujo de trabajo de composición.",
    price: 19.99,
    bpm: 95,
    key: "Do Mayor",
    audioDemoUrl: "https://cdn.pixabay.com/download/audio/2022/08/02/audio_884b9c1d21.mp3?filename=rnb-midi-preview.mp3",
    downloadZipUrl: "#",
    productType: "MIDI",
    createdAt: "2026-03-15",
  },
];

export const INITIAL_PROGRESS: CourseProgressMock[] = [
  { id: "prg-1", userId: "usr-2", lessonId: "les-1001", completed: true, completedAt: "2026-02-15" },
  { id: "prg-2", userId: "usr-2", lessonId: "les-1002", completed: true, completedAt: "2026-02-16" },
  { id: "prg-3", userId: "usr-3", lessonId: "les-1001", completed: true, completedAt: "2026-03-02" },
  { id: "prg-4", userId: "usr-4", lessonId: "les-1001", completed: false },
];

export const INITIAL_PURCHASES: PurchaseMock[] = [
  { id: "pur-1", userId: "usr-2", productType: "COURSE", referenceId: "crs-1", amount: 99.99, status: "COMPLETED", createdAt: "2026-02-14" },
  { id: "pur-2", userId: "usr-3", productType: "COURSE", referenceId: "crs-1", amount: 99.99, status: "COMPLETED", createdAt: "2026-03-01" },
  { id: "pur-3", userId: "usr-4", productType: "COURSE", referenceId: "crs-2", amount: 129.99, status: "COMPLETED", createdAt: "2026-04-12" },
  { id: "pur-4", userId: "usr-5", productType: "MUSIC_ASSET", referenceId: "mp-1", amount: 34.99, status: "COMPLETED", createdAt: "2026-05-19" },
  { id: "pur-5", userId: "usr-2", productType: "MUSIC_ASSET", referenceId: "mp-2", amount: 24.99, status: "COMPLETED", createdAt: "2026-06-01" },
];
