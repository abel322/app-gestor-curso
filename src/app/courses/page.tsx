import { db } from "@/lib/prisma";
import CoursesPageClient from "./CoursesPageClient";
import { ProductType } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function Page() {
  const courses = await db.product.findMany({
    where: {
      type: ProductType.COURSE,
    },
    include: {
      modules: {
        include: {
          lessons: true,
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
        attachments: [],
      })),
    })),
  }));

  return <CoursesPageClient initialCourses={serializedCourses} />;
}
