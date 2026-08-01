import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Poblando la base de datos con datos de prueba...");

  // Limpieza previa
  await prisma.purchase.deleteMany();
  await prisma.courseProgress.deleteMany();
  await prisma.lessonAttachment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.musicProduct.deleteMany();
  await prisma.user.deleteMany();

  // Crear Usuarios
  await prisma.user.create({
    data: { name: "Alex Productor", email: "alex@productor.com", role: "ADMIN" },
  });

  await prisma.user.create({
    data: { name: "Elena Rostova", email: "elena@beats.io", role: "STUDENT" },
  });

  await prisma.user.create({
    data: { name: "Marcos Vance", email: "marcos@diseñodesonido.com", role: "STUDENT" },
  });

  // 1. Curso Profesional de Mezcla de Sonido
  await prisma.course.create({
    data: {
      id: "crs-mezcla",
      title: "Curso Profesional de Mezcla de Sonido",
      slug: "curso-profesional-mezcla-sonido",
      description: "Aprende ecualización quirúrgica, procesamiento dinámico, emulaciones analógicas y técnicas avanzadas de balance espacial para llevar tus canciones a nivel comercial.",
      image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop",
      price: 119.99,
      published: false,
      status: "DRAFT",
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
                  content: "Cómo identificar frecuencias resonantes en bombo, bajo y sintetizadores usando ecualizadores paramétricos de alta precisión.",
                  attachments: {
                    create: [
                      { id: "att-m1", title: "Stems_Multitrack_WAV_Sesion.zip", fileUrl: "#", fileType: "ZIP" },
                      { id: "att-m2", title: "Preset_FabFilter_ProQ3_Limpieza.fxp", fileUrl: "#", fileType: "PRESET" },
                      { id: "att-m3", title: "Guia_Ecualizacion_Pro.pdf", fileUrl: "#", fileType: "PDF" },
                      { id: "att-m4", title: "Groove_Bajo_Midi.mid", fileUrl: "#", fileType: "MIDI" },
                    ],
                  },
                },
                {
                  id: "les-m102",
                  title: "Lección 1.2: Balance de Niveles en Kicks y Bajos",
                  order: 2,
                  duration: 620,
                  isFreePreview: false,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  content: "Técnicas de alineación de fase y calibración VU meter para que el subgrave nunca enmascare la mezcla.",
                  attachments: {
                    create: [
                      { id: "att-m5", title: "Guia_Calibracion_VU.pdf", fileUrl: "#", fileType: "PDF" },
                    ],
                  },
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
                  content: "Cuándo usar un 1176, LA-2A o SSL Bus Compressor para moldear el ataque y sostenido de baterías y voces.",
                  attachments: {
                    create: [
                      { id: "att-m6", title: "Tabla_Tiempos_Ataque_Release.pdf", fileUrl: "#", fileType: "PDF" },
                    ],
                  },
                },
                {
                  id: "les-m202",
                  title: "Lección 2.2: Sidechain Dinámico y Control de Transitorios",
                  order: 2,
                  duration: 750,
                  isFreePreview: false,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  content: "Creación de bombeo sutil y descompresión de frecuencias medias para mantener claridad vocal.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 2. Masterclass de Diseño de Sonido en Serum
  await prisma.course.create({
    data: {
      id: "crs-1",
      title: "Masterclass de Diseño de Sonido en Serum: Cyberpunk y Trap Moderno",
      slug: "masterclass-diseno-sonido-serum",
      description: "Domina la síntesis por tablas de ondas, ruteo avanzado de LFOs y diseño de bajos neón en Xfer Serum. Incluye más de 50 presets y stems de proyecto.",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
      price: 99.99,
      published: true,
      status: "PUBLISHED",
      modules: {
        create: [
          {
            id: "mod-101",
            title: "Módulo 1: Síntesis de Tablas de Ondas y Osciladores Personalizados",
            order: 1,
            lessons: {
              create: [
                {
                  id: "les-1001",
                  title: "1.1 Importación de Tablas de Ondas y Transiciones Suaves",
                  order: 1,
                  duration: 740,
                  isFreePreview: false,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  content: "Aprende a importar formas de onda de audio puro en Xfer Serum y utilizar el editor 3D para suavizar los fotogramas de transición.",
                  attachments: {
                    create: [
                      { id: "att-1", title: "Pack_Tablas_Ondas_Cyberpunk.zip", fileUrl: "#", fileType: "ZIP" },
                      { id: "att-2", title: "Guia_Leccion_1.pdf", fileUrl: "#", fileType: "PDF" },
                    ],
                  },
                },
                {
                  id: "les-1002",
                  title: "1.2 Diseño de Bajos Reese Pesados y Modulación FM",
                  order: 2,
                  duration: 1120,
                  isFreePreview: false,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  content: "Paso a paso para modulación FM desde Osc B hacia Osc A, ruteo de filtros divididos y saturación sub-armónica.",
                  attachments: {
                    create: [
                      { id: "att-3", title: "Bajo_Reese_Preset_Serum.fxp", fileUrl: "#", fileType: "PRESET" },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "mod-102",
            title: "Módulo 2: Secuencias Avanzadas de LFO y Movimiento de Filtros",
            order: 2,
            lessons: {
              create: [
                {
                  id: "les-1003",
                  title: "2.1 Creación de Acordes Vocales Rítmicos con Gate",
                  order: 1,
                  duration: 910,
                  isFreePreview: false,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  content: "Uso del ajuste a la rejilla para diseñar patrones de LFO complejos para compresión sidechain sin plugins de terceros.",
                  attachments: {
                    create: [
                      { id: "att-4", title: "Progresion_Acordes.mid", fileUrl: "#", fileType: "MIDI" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 3. Producción Profesional de Afrobeat y Amapiano
  await prisma.course.create({
    data: {
      id: "crs-2",
      title: "Producción Profesional de Afrobeat y Amapiano",
      slug: "produccion-pro-afrobeat-amapiano",
      description: "Aprende mezcla de Log Drums, cuantización de groove, marimbas melódicas y capas de percusión contagiosas de la mano de productores reconocidos.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
      price: 129.99,
      published: true,
      status: "PUBLISHED",
      modules: {
        create: [
          {
            id: "mod-201",
            title: "Módulo 1: Ritmo, Percusión y Ciencia del Log Drum",
            order: 1,
            lessons: {
              create: [
                {
                  id: "les-2001",
                  title: "1.1 Creación del Bajo Log Drum Característico del Amapiano",
                  order: 1,
                  duration: 850,
                  isFreePreview: false,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  content: "Técnicas de deslizamiento de tono (pitch glide), modelado de envolventes y limpieza de frecuencias graves en mono para grandes sistemas de sonido.",
                  attachments: {
                    create: [
                      { id: "att-5", title: "Kit_Log_Drums_Amapiano.zip", fileUrl: "#", fileType: "ZIP" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Crear Productos Musicales
  await prisma.musicProduct.createMany({
    data: [
      {
        title: "CYBERPUNK 2099 - Pack de Beats y Stems",
        slug: "cyberpunk-2099-beats-stems",
        description: "Stems de producción para synthwave, midtempo oscuro e industrial futurista.",
        price: 34.99,
        bpm: 120,
        key: "Fa# Menor",
        audioDemoUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cyberpunk-beat-120bpm.mp3",
        downloadZipUrl: "#",
        productType: "BEAT",
      },
      {
        title: "NEON SYNTHWAVE V1 - Presets para Serum",
        slug: "neon-synthwave-v1-serum",
        description: "64 Pads analógicos, arpegios retro, metales synth y plucks de los 80.",
        price: 24.99,
        audioDemoUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a739f3.mp3?filename=synthwave-preview.mp3",
        downloadZipUrl: "#",
        productType: "PRESET",
      },
    ],
  });

  console.log("¡Base de datos poblada exitosamente!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
