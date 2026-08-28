import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LessonPlayerClient from "./LessonPlayerClient";

export const dynamic = "force-dynamic";

interface LessonPlayerPageProps {
  params: {
    slug: string;
    lessonId: string;
  };
}

export default async function Page({ params }: LessonPlayerPageProps) {
  const course = await db.product.findUnique({
    where: { slug: params.slug },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              attachments: true,
            },
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
  });

  if (!course) {
    notFound();
  }

  const serializedCourse = {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    image: course.thumbnailUrl,
    price: course.price,
    published: course.status === "PUBLISHED",
    status: course.status as 'DRAFT' | 'PUBLISHED' | 'DRIP_SCHEDULED',
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
        content: les.content || undefined,
        duration: les.duration || 0,
        isFreePreview: les.isFreePreview,
        order: les.order,
        moduleId: les.moduleId,
        attachments: les.attachments.map((att) => ({
          id: att.id,
          title: att.title,
          fileUrl: att.fileUrl,
          fileType: att.fileType as 'PDF' | 'MIDI' | 'PRESET' | 'ZIP',
        })),
      })),
    })),
  };

  return <LessonPlayerClient course={serializedCourse} lessonId={params.lessonId} />;
}
