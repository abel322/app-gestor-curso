"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCourseAction(data: {
  title: string;
  description: string;
  price: number;
  image: string;
}) {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const course = await db.course.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      price: data.price,
      image: data.image,
      published: false,
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/courses/builder");
  revalidatePath("/courses");
  return course;
}

export async function togglePublishCourseAction(courseId: string, published: boolean) {
  const status = published ? "PUBLISHED" : "DRAFT";
  const course = await db.course.update({
    where: { id: courseId },
    data: {
      published,
      status,
    },
  });

  revalidatePath("/admin/courses/builder");
  revalidatePath("/courses");
  revalidatePath(`/courses/${course.slug}`);
  return course;
}

export async function createModuleAction(courseId: string, title: string, order: number) {
  const module = await db.module.create({
    data: {
      courseId,
      title,
      order,
    },
  });

  const course = await db.course.findUnique({ where: { id: courseId }, select: { slug: true } });
  revalidatePath("/admin/courses/builder");
  if (course) revalidatePath(`/courses/${course.slug}`);
  return module;
}

export async function deleteModuleAction(moduleId: string) {
  const module = await db.module.delete({
    where: { id: moduleId },
    include: { course: true }
  });

  revalidatePath("/admin/courses/builder");
  if (module.course) revalidatePath(`/courses/${module.course.slug}`);
  return module;
}

export async function updateModuleOrderAction(modules: { id: string; order: number }[]) {
  const updates = modules.map((m) =>
    db.module.update({
      where: { id: m.id },
      data: { order: m.order },
      include: { course: true }
    })
  );
  const results = await Promise.all(updates);

  revalidatePath("/admin/courses/builder");
  if (results[0]?.course) revalidatePath(`/courses/${results[0].course.slug}`);
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
        include: { course: true }
      }
    }
  });

  revalidatePath("/admin/courses/builder");
  if (lesson.module?.course) revalidatePath(`/courses/${lesson.module.course.slug}`);
  return lesson;
}

export async function deleteLessonAction(lessonId: string) {
  const lesson = await db.lesson.delete({
    where: { id: lessonId },
    include: {
      module: {
        include: { course: true }
      }
    }
  });

  revalidatePath("/admin/courses/builder");
  if (lesson.module?.course) revalidatePath(`/courses/${lesson.module.course.slug}`);
  return lesson;
}

export async function updateLessonOrderAction(lessons: { id: string; order: number }[]) {
  const updates = lessons.map((l) =>
    db.lesson.update({
      where: { id: l.id },
      data: { order: l.order },
      include: {
        module: {
          include: { course: true }
        }
      }
    })
  );
  const results = await Promise.all(updates);

  revalidatePath("/admin/courses/builder");
  const courseSlug = results[0]?.module?.course?.slug;
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
        include: { course: true }
      }
    }
  });

  revalidatePath("/admin/courses/builder");
  if (lesson.module?.course) {
    revalidatePath(`/courses/${lesson.module.course.slug}`);
    revalidatePath(`/courses/${lesson.module.course.slug}/lessons/${lessonId}`);
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
            include: { course: true }
          }
        }
      }
    }
  });

  revalidatePath("/admin/courses/builder");
  if (attachment.lesson?.module?.course) {
    revalidatePath(`/courses/${attachment.lesson.module.course.slug}`);
    revalidatePath(`/courses/${attachment.lesson.module.course.slug}/lessons/${lessonId}`);
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
            include: { course: true }
          }
        }
      }
    }
  });

  revalidatePath("/admin/courses/builder");
  if (attachment.lesson?.module?.course) {
    revalidatePath(`/courses/${attachment.lesson.module.course.slug}`);
    revalidatePath(`/courses/${attachment.lesson.module.course.slug}/lessons/${attachment.lessonId}`);
  }
  return attachment;
}
