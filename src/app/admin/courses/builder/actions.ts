"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductType, ProductStatus } from "@prisma/client";

export async function createCourseAction(data: {
  title: string;
  description: string;
  price: number;
  image: string;
}) {
  const baseSlug = data.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

  const course = await db.product.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      price: Number(data.price),
      thumbnailUrl: data.image,
      type: ProductType.COURSE,
      category: "Educación & Cursos",
      status: ProductStatus.DRAFT,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/courses/builder");
  revalidatePath("/courses");
  return course;
}

export async function togglePublishCourseAction(courseId: string, published: boolean) {
  const status = published ? ProductStatus.PUBLISHED : ProductStatus.DRAFT;
  const course = await db.product.update({
    where: { id: courseId },
    data: {
      status,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/courses/builder");
  revalidatePath("/courses");
  revalidatePath(`/courses/${course.slug}`);
  return course;
}

export async function createModuleAction(courseId: string, title: string, order: number) {
  const module = await db.courseModule.create({
    data: {
      productId: courseId,
      title,
      order,
    },
  });

  const course = await db.product.findUnique({ where: { id: courseId }, select: { slug: true } });
  revalidatePath("/admin/courses/builder");
  revalidatePath("/admin/products");
  if (course) revalidatePath(`/courses/${course.slug}`);
  return module;
}

export async function deleteModuleAction(moduleId: string) {
  const module = await db.courseModule.delete({
    where: { id: moduleId },
    include: { product: true }
  });

  revalidatePath("/admin/courses/builder");
  revalidatePath("/admin/products");
  if (module.product) revalidatePath(`/courses/${module.product.slug}`);
  return module;
}

export async function updateModuleOrderAction(modules: { id: string; order: number }[]) {
  const updates = modules.map((m) =>
    db.courseModule.update({
      where: { id: m.id },
      data: { order: m.order },
      include: { product: true }
    })
  );
  const results = await Promise.all(updates);

  revalidatePath("/admin/courses/builder");
  revalidatePath("/admin/products");
  if (results[0]?.product) revalidatePath(`/courses/${results[0].product.slug}`);
  return results;
}

export async function createLessonAction(moduleId: string, title: string, order: number) {
  const lesson = await db.lesson.create({
    data: {
      moduleId,
      title,
      order,
      duration: 600, // default 10 mins
      isFreePreview: false,
    },
    include: {
      module: {
        include: { product: true }
      }
    }
  });

  revalidatePath("/admin/courses/builder");
  if (lesson.module?.product) revalidatePath(`/courses/${lesson.module.product.slug}`);
  return lesson;
}

export async function deleteLessonAction(lessonId: string) {
  const lesson = await db.lesson.delete({
    where: { id: lessonId },
    include: {
      module: {
        include: { product: true }
      }
    }
  });

  revalidatePath("/admin/courses/builder");
  if (lesson.module?.product) revalidatePath(`/courses/${lesson.module.product.slug}`);
  return lesson;
}

export async function updateLessonOrderAction(lessons: { id: string; order: number }[]) {
  const updates = lessons.map((l) =>
    db.lesson.update({
      where: { id: l.id },
      data: { order: l.order },
      include: {
        module: {
          include: { product: true }
        }
      }
    })
  );
  const results = await Promise.all(updates);

  revalidatePath("/admin/courses/builder");
  const courseSlug = results[0]?.module?.product?.slug;
  if (courseSlug) revalidatePath(`/courses/${courseSlug}`);
  return results;
}

export async function updateLessonAction(
  lessonId: string,
  data: {
    title: string;
    videoUrl?: string;
    content?: string;
    duration: number;
    isFreePreview: boolean;
  }
) {
  const lesson = await db.lesson.update({
    where: { id: lessonId },
    data: {
      title: data.title,
      videoUrl: data.videoUrl || null,
      content: data.content || null,
      duration: data.duration,
      isFreePreview: data.isFreePreview,
    },
    include: {
      module: {
        include: { product: true }
      }
    }
  });

  revalidatePath("/admin/courses/builder");
  if (lesson.module?.product) {
    revalidatePath(`/courses/${lesson.module.product.slug}`);
    revalidatePath(`/courses/${lesson.module.product.slug}/lessons/${lessonId}`);
  }
  return lesson;
}

export async function addLessonAttachmentAction(
  lessonId: string,
  data: {
    title: string;
    fileUrl: string;
    fileType: string;
  }
) {
  const attachment = await db.lessonAttachment.create({
    data: {
      lessonId,
      title: data.title,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
    },
    include: {
      lesson: {
        include: {
          module: {
            include: { product: true }
          }
        }
      }
    }
  });

  revalidatePath("/admin/courses/builder");
  if (attachment.lesson?.module?.product) {
    revalidatePath(`/courses/${attachment.lesson.module.product.slug}`);
    revalidatePath(`/courses/${attachment.lesson.module.product.slug}/lessons/${lessonId}`);
  }
  return attachment;
}

export async function deleteLessonAttachmentAction(attachmentId: string) {
  const attachment = await db.lessonAttachment.delete({
    where: { id: attachmentId },
    include: {
      lesson: {
        include: {
          module: {
            include: { product: true }
          }
        }
      }
    }
  });

  revalidatePath("/admin/courses/builder");
  if (attachment.lesson?.module?.product) {
    revalidatePath(`/courses/${attachment.lesson.module.product.slug}`);
    revalidatePath(`/courses/${attachment.lesson.module.product.slug}/lessons/${attachment.lessonId}`);
  }
  return attachment;
}
