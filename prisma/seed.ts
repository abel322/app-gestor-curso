import { PrismaClient, ProductType, ProductStatus, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Poblando la base de datos PostgreSQL con datos de catálogo unificado...");

  // Limpieza previa respetando orden de dependencias
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1. Crear Usuarios
  const adminUser = await prisma.user.create({
    data: { id: "usr-1", name: "Alex Productor", email: "alex@productor.com", role: Role.ADMIN },
  });

  const customerUser1 = await prisma.user.create({
    data: { id: "usr-2", name: "Elena Rostova", email: "elena@beats.io", role: Role.CUSTOMER },
  });

  await prisma.user.create({
    data: { id: "usr-3", name: "Marcos Vance", email: "marcos@diseñodesonido.com", role: Role.CUSTOMER },
  });

  // 2. PRODUCTO: CURSO ONLINE 1
  const course1 = await prisma.product.create({
    data: {
      id: "prod-course-mezcla",
      title: "Curso Profesional de Mezcla de Sonido",
      slug: "curso-profesional-mezcla-sonido",
      description: "Aprende ecualización quirúrgica, procesamiento dinámico, emulaciones analógicas y técnicas avanzadas de balance espacial para llevar tus canciones a nivel comercial.",
      price: 119.99,
      salePrice: 89.99,
      type: ProductType.COURSE,
      category: "Mezcla & Mastering",
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop",
      previewAudioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=mixing-demo.mp3",
      downloadFileUrl: "https://storage.synthesis.studio/courses/stems-mezcla.zip",
      fileSize: "2.4 GB",
      formatInfo: "24 Lecciones HD + Stems Multitrack",
      modules: {
        create: [
          {
            id: "mod-m1",
            title: "Módulo 1: Ecualización y Balance",
            order: 1,
            lessons: {
              create: [
                {
                  id: "les-m101",
                  title: "Lección 1.1: Limpieza de Frecuencias y Filtros Paso Alto",
                  order: 1,
                  duration: 840,
                  isFreePreview: true,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                },
                {
                  id: "les-m102",
                  title: "Lección 1.2: Balance de Niveles en Kicks y Bajos",
                  order: 2,
                  duration: 620,
                  isFreePreview: false,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                },
              ],
            },
          },
          {
            id: "mod-m2",
            title: "Módulo 2: Compresión y Dinámica",
            order: 2,
            lessons: {
              create: [
                {
                  id: "les-m201",
                  title: "Lección 2.1: Compresión VCA vs FET vs Opto",
                  order: 1,
                  duration: 980,
                  isFreePreview: false,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 3. PRODUCTO: CURSO ONLINE 2
  await prisma.product.create({
    data: {
      id: "prod-course-serum",
      title: "Masterclass de Diseño de Sonido en Serum: Cyberpunk y Trap",
      slug: "masterclass-diseno-sonido-serum",
      description: "Domina la síntesis por tablas de ondas, ruteo avanzado de LFOs y diseño de bajos neón en Xfer Serum. Incluye más de 50 presets y stems de proyecto.",
      price: 99.99,
      salePrice: 69.99,
      type: ProductType.COURSE,
      category: "Síntesis",
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
      thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
      previewAudioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a739f3.mp3?filename=serum-demo.mp3",
      downloadFileUrl: "https://storage.synthesis.studio/courses/serum-presets.zip",
      fileSize: "850 MB",
      formatInfo: "18 Video Lecciones + 50 Presets",
      modules: {
        create: [
          {
            id: "mod-serum-1",
            title: "Módulo 1: Osciladores y Modulación FM",
            order: 1,
            lessons: {
              create: [
                {
                  id: "les-serum-101",
                  title: "1.1 Importación de Tablas de Ondas y Transiciones Suaves",
                  order: 1,
                  duration: 740,
                  isFreePreview: true,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 4. PRODUCTO: SAMPLE PACK
  const samplePack = await prisma.product.create({
    data: {
      id: "prod-sample-cyberpunk",
      title: "CYBERPUNK 2099 - Drum Kit & Wav Samples",
      slug: "cyberpunk-2099-drum-kit-wav-samples",
      description: "Colección masiva de Kicks Cyber, Snares industriales, Hi-Hats procesados con hardware analógico y FX futuristas sin derechos de autor.",
      price: 34.99,
      salePrice: 24.99,
      type: ProductType.SAMPLE_PACK,
      category: "Cyberpunk / Synthwave",
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
      previewAudioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cyberpunk-drums-demo.mp3",
      downloadFileUrl: "https://storage.synthesis.studio/packs/cyberpunk-2099-samples.zip",
      fileSize: "1.2 GB",
      bpm: 120,
      key: "F# Minor",
      formatInfo: "350 WAV Samples (24-bit / 44.1kHz) + 30 MIDIs",
    },
  });

  // 5. PRODUCTO: LOOP
  await prisma.product.create({
    data: {
      id: "prod-loop-afrobeat",
      title: "AFROBEAT & AMAPIANO GUITAR LOOPS 2026",
      slug: "afrobeat-amapiano-guitar-loops-2026",
      description: "Loops de guitarra limpia y procesada grabado por músicos de sesión profesional. Cuantizados en 115 BPM a 125 BPM con claves especificadas.",
      price: 29.99,
      salePrice: 19.99,
      type: ProductType.LOOP,
      category: "Afrobeat / Amapiano",
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
      previewAudioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=afrobeat-loop-demo.mp3",
      downloadFileUrl: "https://storage.synthesis.studio/loops/afrobeat-guitar-loops.zip",
      fileSize: "680 MB",
      bpm: 118,
      key: "C Major",
      formatInfo: "60 Guitarras WAV Loops Stem-by-Stem",
    },
  });

  // 6. PRODUCTO: TRACK / BEAT
  await prisma.product.create({
    data: {
      id: "prod-track-darkbeat",
      title: "MIDNIGHT RHAPSODY - Master Beat Track (WAV + Stems)",
      slug: "midnight-rhapsody-master-beat-track",
      description: "Pista / Beat completo de Trap Latino y R&B con estructura terminada, mezcla profesional y stems individuales listos para voz.",
      price: 49.99,
      salePrice: null,
      type: ProductType.TRACK,
      category: "Trap / R&B",
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
      thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
      previewAudioUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2741d408f.mp3?filename=midnight-beat-preview.mp3",
      downloadFileUrl: "https://storage.synthesis.studio/tracks/midnight-rhapsody-stems.zip",
      fileSize: "450 MB",
      bpm: 140,
      key: "A Minor",
      formatInfo: "Master WAV 24-Bit + Stems Separados",
    },
  });

  // 7. PRODUCTO: BUNDLE
  await prisma.product.create({
    data: {
      id: "prod-bundle-producer-vault",
      title: "PRODUCER VAULT 2026 - Ultimate Everything Bundle",
      slug: "producer-vault-2026-ultimate-everything-bundle",
      description: "Todo el catálogo de loops, sample packs, presets de Serum y plantillas en un solo paquete definitivo con descuento del 60%.",
      price: 199.99,
      salePrice: 99.99,
      type: ProductType.BUNDLE,
      category: "Bundle Multigénero",
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
      previewAudioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=bundle-demo.mp3",
      downloadFileUrl: "https://storage.synthesis.studio/bundles/producer-vault-2026.zip",
      fileSize: "5.5 GB",
      bpm: 130,
      key: "Varios Keys",
      formatInfo: "5 Pack de Samples + 120 Loops + 100 Presets",
    },
  });

  // 8. PRODUCTO BORRADOR (DRAFT)
  await prisma.product.create({
    data: {
      id: "prod-draft-lofi",
      title: "LO-FI CHILL ROOM VOL. 2 (Próximo Lanzamiento)",
      slug: "lo-fi-chill-room-vol-2",
      description: "Bienes en borrador para pruebas de administración y publicación.",
      price: 19.99,
      type: ProductType.SAMPLE_PACK,
      category: "Lo-Fi",
      status: ProductStatus.DRAFT,
      isFeatured: false,
      thumbnailUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
      previewAudioUrl: null,
      downloadFileUrl: null,
      fileSize: "320 MB",
      bpm: 85,
      key: "E Minor",
      formatInfo: "40 Vinyl Drums + 15 Piano Loops",
    },
  });

  console.log("¡Base de datos sembrada con éxito con catálogo multiproducto!");
}

main()
  .catch((e) => {
    console.error("Error al sembrar la base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
