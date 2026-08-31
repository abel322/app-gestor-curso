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

  const serializedCourses = courses.map((course) => ({
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

  const serializedUsers = users.map((u) => ({
    id: u.id,
    name: u.name || "Usuario",
    email: u.email,
    role: u.role as 'ADMIN' | 'CUSTOMER',
    createdAt: u.createdAt.toISOString().split("T")[0],
  }));

  return (
    <StudentMatrixClient
      initialCourses={serializedCourses}
      initialUsers={serializedUsers as any}
      initialProgress={[]}
    />
  );
}
