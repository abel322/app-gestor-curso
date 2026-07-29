import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing
  await prisma.purchase.deleteMany();
  await prisma.courseProgress.deleteMany();
  await prisma.lessonAttachment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.musicProduct.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const user1 = await prisma.user.create({
    data: { name: "Alex Producer", email: "alex@producer.com", role: "ADMIN" },
  });

  const user2 = await prisma.user.create({
    data: { name: "Elena Rostova", email: "elena@beats.io", role: "STUDENT" },
  });

  const user3 = await prisma.user.create({
    data: { name: "Marcus Vance", email: "marcus@sounddesign.com", role: "STUDENT" },
  });

  // Create Courses & Modules
  const course1 = await prisma.course.create({
    data: {
      title: "Serum Sound Design Masterclass: Modern Cyberpunk & Trap",
      slug: "serum-sound-design-masterclass",
      description: "Master wavetable synthesis, custom LFO routing, and neon bass design inside Xfer Serum. Includes 50+ project stems and presets.",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
      price: 99.99,
      published: true,
      status: "PUBLISHED",
      modules: {
        create: [
          {
            title: "Module 1: Wavetable Synthesis & Custom Oscillators",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1.1 Introduction to Custom Wavetable Import & Morphing",
                  order: 1,
                  duration: 740,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  content: "Learn how to import raw audio waveforms into Xfer Serum and smooth out transition frames.",
                  attachments: {
                    create: [
                      { title: "Cyberpunk Wavetable Pack.zip", fileUrl: "#", fileType: "ZIP" },
                    ],
                  },
                },
                {
                  title: "1.2 Designing Heavy Reese Basses & FM Modulation",
                  order: 2,
                  duration: 1120,
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  content: "Step-by-step FM from Osc B into Osc A, routing split filters and sub-harmonic saturation.",
                  attachments: {
                    create: [
                      { title: "Heavy_Reese_Serum_Preset.fxp", fileUrl: "#", fileType: "PRESET" },
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

  // Create Music Products
  await prisma.musicProduct.createMany({
    data: [
      {
        title: "CYBERPUNK 2099 - Beats & Stems Pack",
        slug: "cyberpunk-2099-beats-stems",
        description: "Hard-hitting synthwave, dark midtempo, and futuristic industrial beat stems.",
        price: 34.99,
        bpm: 120,
        key: "F# Minor",
        audioDemoUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cyberpunk-beat-120bpm.mp3",
        downloadZipUrl: "#",
        productType: "BEAT",
      },
      {
        title: "NEON SYNTHWAVE V1 - Serum Presets",
        slug: "neon-synthwave-v1-serum",
        description: "64 Lush analog pads, retro arps, punchy synth brass, and 80s plucks.",
        price: 24.99,
        audioDemoUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a739f3.mp3?filename=synthwave-preview.mp3",
        downloadZipUrl: "#",
        productType: "PRESET",
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
