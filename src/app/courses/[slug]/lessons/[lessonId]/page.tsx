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
  const course = await db.course.findUnique({
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
    ...course,
    createdAt: course.createdAt.toISOString().split("T")[0],
    status: course.status as 'DRAFT' | 'PUBLISHED' | 'DRIP_SCHEDULED',
    modules: course.modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((les) => ({
        ...les,
        videoUrl: les.videoUrl || undefined,
        content: les.content || undefined,
        attachments: les.attachments.map((att) => ({
          ...att,
          fileType: att.fileType as 'PDF' | 'MIDI' | 'PRESET' | 'ZIP',
        })),
      })),
    })),
  };

  return <LessonPlayerClient course={serializedCourse} lessonId={params.lessonId} />;
}
