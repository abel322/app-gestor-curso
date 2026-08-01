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
  isFreePreview?: boolean;
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

export const INITIAL_COURSES: CourseMock[] = [];

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
