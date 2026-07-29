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
  duration: number; // in seconds
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
  { id: "usr-1", name: "Alex Producer", email: "alex@producer.com", role: "ADMIN", createdAt: "2026-01-10" },
  { id: "usr-2", name: "Elena Rostova", email: "elena@beats.io", role: "STUDENT", createdAt: "2026-02-14" },
  { id: "usr-3", name: "Marcus Vance", email: "marcus@sounddesign.com", role: "STUDENT", createdAt: "2026-03-01" },
  { id: "usr-4", name: "David Kim", email: "dkim@music.net", role: "STUDENT", createdAt: "2026-04-12" },
  { id: "usr-5", name: "Sarah Connor", email: "sarah@synthwave.org", role: "CUSTOMER", createdAt: "2026-05-19" },
];

export const INITIAL_COURSES: CourseMock[] = [
  {
    id: "crs-1",
    title: "Serum Sound Design Masterclass: Modern Cyberpunk & Trap",
    slug: "serum-sound-design-masterclass",
    description: "Master wavetable synthesis, custom LFO routing, and neon bass design inside Xfer Serum. Includes 50+ project stems and presets.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
    price: 99.99,
    published: true,
    status: "PUBLISHED",
    createdAt: "2026-01-15",
    modules: [
      {
        id: "mod-101",
        title: "Module 1: Wavetable Synthesis & Custom Oscillators",
        order: 1,
        courseId: "crs-1",
        lessons: [
          {
            id: "les-1001",
            title: "1.1 Introduction to Custom Wavetable Import & Morphing",
            order: 1,
            duration: 740,
            moduleId: "mod-101",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Learn how to import raw audio waveforms into Xfer Serum and use the 3D Wavetable Editor to smooth out transition frames.",
            attachments: [
              { id: "att-1", title: "Cyberpunk Wavetable Pack.zip", fileUrl: "#", fileType: "ZIP" },
              { id: "att-2", title: "Lesson 1 Cheatsheet.pdf", fileUrl: "#", fileType: "PDF" },
            ],
          },
          {
            id: "les-1002",
            title: "1.2 Designing Heavy Reese Basses & FM Modulation",
            order: 2,
            duration: 1120,
            moduleId: "mod-101",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Step-by-step FM from Osc B into Osc A, routing split filters and sub-harmonic saturation for hard-hitting basslines.",
            attachments: [
              { id: "att-3", title: "Heavy_Reese_Serum_Preset.fxp", fileUrl: "#", fileType: "PRESET" },
            ],
          },
        ],
      },
      {
        id: "mod-102",
        title: "Module 2: Advanced LFO Sequences & Filter Motion",
        order: 2,
        courseId: "crs-1",
        lessons: [
          {
            id: "les-1003",
            title: "2.1 Creating Dynamic Gated Vocal Chords",
            order: 1,
            duration: 910,
            moduleId: "mod-102",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Using grid snapping to draw complex LFO shapes for rhythm sidechaining without third-party plugins.",
            attachments: [
              { id: "att-4", title: "Gated_Chord_Chords.mid", fileUrl: "#", fileType: "MIDI" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "crs-2",
    title: "Afrobeat & Amapiano Music Production Pro",
    slug: "afrobeat-amapiano-production-pro",
    description: "Learn log drum mixing, groove quantization, melodic marimbas, and infectious percussive layering from industry hitmakers.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    price: 129.99,
    published: true,
    status: "PUBLISHED",
    createdAt: "2026-02-01",
    modules: [
      {
        id: "mod-201",
        title: "Module 1: Rhythm, Percussion & Log Drum Science",
        order: 1,
        courseId: "crs-2",
        lessons: [
          {
            id: "les-2001",
            title: "1.1 Crafting the Signature Amapiano Log Drum Bassline",
            order: 1,
            duration: 850,
            moduleId: "mod-201",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Pitch glide techniques, envelope shaping, and low-end mono cleanup for massive club sound systems.",
            attachments: [
              { id: "att-5", title: "Amapiano Log Drums Starter Kit.zip", fileUrl: "#", fileType: "ZIP" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "crs-3",
    title: "Mixing & Mastering with Analog Emulations",
    slug: "mixing-mastering-analog-emulations",
    description: "Transform muddy bedroom demos into commercial-ready masters using SSL channel strips, Neve tape saturation, and dynamic EQing.",
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop",
    price: 149.99,
    published: false,
    status: "DRAFT",
    createdAt: "2026-03-10",
    modules: [
      {
        id: "mod-301",
        title: "Module 1: Gain Staging & Vocal Mixing",
        order: 1,
        courseId: "crs-3",
        lessons: [
          {
            id: "les-3001",
            title: "1.1 Vocal De-Essing, Compression & Stereo Width",
            order: 1,
            duration: 1200,
            moduleId: "mod-301",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "Carving space for lead vocals in dense electronic mixdowns.",
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
    title: "CYBERPUNK 2099 - Beats & Stems Pack",
    slug: "cyberpunk-2099-beats-stems",
    description: "Hard-hitting synthwave, dark midtempo, and futuristic industrial beat stems with full commercial license.",
    price: 34.99,
    bpm: 120,
    key: "F# Minor",
    audioDemoUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cyberpunk-beat-120bpm.mp3",
    downloadZipUrl: "#",
    productType: "BEAT",
    createdAt: "2026-01-20",
  },
  {
    id: "mp-2",
    title: "NEON SYNTHWAVE V1 - Serum Presets",
    slug: "neon-synthwave-v1-serum",
    description: "64 Lush analog pads, retro arps, punchy synth brass, and 80s plucks carefully tuned for modern retro pop.",
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
    title: "AFROGROOVE VOL. 3 - Percussion & Samples",
    slug: "afrogroove-vol-3-percussion",
    description: "Over 450+ 24-bit WAV drums, shaking shakers, log drum shots, dynamic vocal chops, and organic loops.",
    price: 29.99,
    bpm: 112,
    key: "A Minor",
    audioDemoUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=afrobeats-loop.mp3",
    downloadZipUrl: "#",
    productType: "SAMPLE_PACK",
    createdAt: "2026-02-28",
  },
  {
    id: "mp-4",
    title: "CHORD MAESTRO - 100+ Neo-Soul MIDI Progression Kits",
    slug: "chord-maestro-midi-kits",
    description: "Pro 7th, 9th, and 11th chord progressions in all 12 keys. Instantly boost your songwriting workflow.",
    price: 19.99,
    bpm: 95,
    key: "C Major",
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
