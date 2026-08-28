import { db } from "@/lib/prisma";
import StudentMatrixClient from "./StudentMatrixClient";
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
      },
    },
  });

  const users = await db.user.findMany();
  const progress = await db.courseProgress.findMany();

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

  const serializedUsers = users.map((u) => ({
    ...u,
    role: u.role as 'ADMIN' | 'STUDENT' | 'CUSTOMER',
    createdAt: u.createdAt.toISOString().split("T")[0],
  }));

  const serializedProgress = progress.map((pr) => ({
    ...pr,
    completedAt: pr.completedAt ? pr.completedAt.toISOString().split("T")[0] : undefined,
  }));

  return (
    <StudentMatrixClient
      initialCourses={serializedCourses}
      initialUsers={serializedUsers}
      initialProgress={serializedProgress}
    />
  );
}
