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

  // Crear Cursos y Módulos
  await prisma.course.create({
    data: {
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
            title: "Módulo 1: Síntesis de Tablas de Ondas y Osciladores Personalizados",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1.1 Importación de Tablas de Ondas y Transiciones Suaves",
                  order: 1,
                  duration: 740,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  content: "Aprende a importar formas de onda de audio puro en Xfer Serum y utilizar el editor 3D para suavizar los fotogramas de transición.",
                  attachments: {
                    create: [
                      { title: "Pack_Tablas_Ondas_Cyberpunk.zip", fileUrl: "#", fileType: "ZIP" },
                    ],
                  },
                },
                {
                  title: "1.2 Diseño de Bajos Reese Pesados y Modulación FM",
                  order: 2,
                  duration: 1120,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  content: "Paso a paso para modulación FM desde Osc B hacia Osc A, ruteo de filtros divididos y saturación sub-armónica.",
                  attachments: {
                    create: [
                      { title: "Bajo_Reese_Preset_Serum.fxp", fileUrl: "#", fileType: "PRESET" },
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
