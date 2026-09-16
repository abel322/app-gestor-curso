import { db } from "@/lib/prisma";
import CourseBuilderClient from "./CourseBuilderClient";
import { ProductType } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function Page() {
  let serializedCourses: any[] = [];

  try {
    const courses = await db.product.findMany({
      where: {
        type: ProductType.COURSE,
      },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    serializedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      image: course.thumbnailUrl,
      price: course.price,
      published: course.status === "PUBLISHED",
      status: (course.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT') as 'DRAFT' | 'PUBLISHED' | 'DRIP_SCHEDULED',
      createdAt: course.createdAt.toISOString().split("T")[0],
      modules: course.modules.map((mod) => ({
        id: mod.id,
        title: mod.title,
        order: mod.order,
        courseId: mod.productId,
        lessons: mod.lessons.map((les) => ({
          id: les.id,
          title: les.title,
          videoUrl: les.videoUrl || undefined,
          content: undefined,
          duration: les.duration || 0,
          isFreePreview: les.isFreePreview,
          order: les.order,
          moduleId: les.moduleId,
          attachments: [],
        })),
      })),
    }));
  } catch (err) {
    console.warn("PostgreSQL connection not reachable, serving initial demo course for builder:", err);
    serializedCourses = [
      {
        id: "crs-pro-mixing",
        title: "Masterclass Profesional de Mezcla & Mastering",
        slug: "masterclass-profesional-mezcla-mastering",
        description: "Aprende ecualización quirúrgica, compresión dinámica, procesamiento estéreo y balance armónico.",
        image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop",
        price: 149.99,
        published: false,
        status: "DRAFT",
        createdAt: "2026-03-01",
        modules: [
          {
            id: "mod-1",
            title: "Módulo 1: Fundamentos Acústicos y Ecualización Analógica",
            order: 1,
            courseId: "crs-pro-mixing",
            lessons: [
              {
                id: "les-101",
                title: "Lección 1.1: Fase, Limpieza de Graves y Curvas Quirúrgicas",
                order: 1,
                duration: 900,
                isFreePreview: true,
                moduleId: "mod-1",
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                content: "Análisis de alineación temporal en cajas y bombos, y eliminación de resonancias parásitas.",
                attachments: [
                  { id: "att-1", title: "Stems_Multitrack_WAV.zip", fileUrl: "#", fileType: "ZIP" },
                  { id: "att-2", title: "Guia_Ecualizacion_EQ.pdf", fileUrl: "#", fileType: "PDF" }
                ],
              },
              {
                id: "les-102",
                title: "Lección 1.2: Compresión VCA vs Óptica y Vari-Mu",
                order: 2,
                duration: 1200,
                isFreePreview: false,
                moduleId: "mod-1",
                videoUrl: "",
                content: "Diferenciación sonora entre tiempos de ataque rápidos de transitorios y compresión musical de pegamento de buses.",
                attachments: [],
              },
            ],
          },
          {
            id: "mod-2",
            title: "Módulo 2: Procesamiento Espacial, Reverbs y Masterización",
            order: 2,
            courseId: "crs-pro-mixing",
            lessons: [
              {
                id: "les-201",
                title: "Lección 2.1: Reverbs de Convolución y Posicionamiento 3D",
                order: 1,
                duration: 780,
                isFreePreview: false,
                moduleId: "mod-2",
                videoUrl: "",
                content: "Diseño de profundidad de campo mediante pre-delay calibrado al tempo de la canción.",
                attachments: [],
              },
            ],
          },
        ],
      },
    ];
  }

  return <CourseBuilderClient initialCourses={serializedCourses} />;
}
