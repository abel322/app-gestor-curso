import { db } from "@/lib/prisma";
import CourseBuilderClient from "./CourseBuilderClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const courses = await db.course.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedCourses = courses.map((course) => ({
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
  }));

  return <CourseBuilderClient initialCourses={serializedCourses} />;
}
