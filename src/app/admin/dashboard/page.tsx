import { db } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const courses = await db.course.findMany({
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  const purchases = await db.purchase.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const users = await db.user.findMany();
  const progress = await db.courseProgress.findMany();

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
        attachments: [],
      })),
    })),
  }));

  const serializedPurchases = purchases.map((p) => ({
    ...p,
    productType: p.productType as 'COURSE' | 'MUSIC_ASSET',
    status: p.status as 'COMPLETED' | 'PENDING' | 'REFUNDED',
    createdAt: p.createdAt.toISOString().split("T")[0],
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
    <AdminDashboardClient
      initialCourses={serializedCourses}
      initialPurchases={serializedPurchases}
      initialUsers={serializedUsers}
      initialProgress={serializedProgress}
    />
  );
}
