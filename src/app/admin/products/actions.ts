"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductType, ProductStatus } from "@prisma/client";

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  salePrice?: number | null;
  type: ProductType;
  category: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  thumbnailUrl: string;
  previewAudioUrl?: string | null;
  downloadFileUrl?: string | null;
  fileSize?: string | null;
  bpm?: number | null;
  key?: string | null;
  formatInfo?: string | null;
}

function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  
  return `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
}

export async function createProductAction(data: ProductFormData) {
  const slug = generateSlug(data.title);

  const product = await db.product.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      price: Number(data.price),
      salePrice: data.salePrice ? Number(data.salePrice) : null,
      type: data.type,
      category: data.category || "General",
      status: data.status || ProductStatus.DRAFT,
      isFeatured: Boolean(data.isFeatured),
      thumbnailUrl: data.thumbnailUrl || "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop",
      previewAudioUrl: data.previewAudioUrl || null,
      downloadFileUrl: data.downloadFileUrl || null,
      fileSize: data.fileSize || null,
      bpm: data.bpm ? Number(data.bpm) : null,
      key: data.key || null,
      formatInfo: data.formatInfo || null,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/courses/builder");
  revalidatePath("/store");
  revalidatePath("/courses");
  return product;
}

export async function updateProductAction(productId: string, data: Partial<ProductFormData>) {
  const existing = await db.product.findUnique({ where: { id: productId } });
  if (!existing) {
    throw new Error("Producto no encontrado");
  }

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = Number(data.price);
  if (data.salePrice !== undefined) updateData.salePrice = data.salePrice ? Number(data.salePrice) : null;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);
  if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
  if (data.previewAudioUrl !== undefined) updateData.previewAudioUrl = data.previewAudioUrl || null;
  if (data.downloadFileUrl !== undefined) updateData.downloadFileUrl = data.downloadFileUrl || null;
  if (data.fileSize !== undefined) updateData.fileSize = data.fileSize || null;
  if (data.bpm !== undefined) updateData.bpm = data.bpm ? Number(data.bpm) : null;
  if (data.key !== undefined) updateData.key = data.key || null;
  if (data.formatInfo !== undefined) updateData.formatInfo = data.formatInfo || null;

  const product = await db.product.update({
    where: { id: productId },
    data: updateData,
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/courses/builder");
  revalidatePath("/store");
  revalidatePath("/courses");
  revalidatePath(`/courses/${product.slug}`);
  return product;
}

export async function togglePublishProductAction(productId: string, nextStatus: ProductStatus) {
  const product = await db.product.update({
    where: { id: productId },
    data: {
      status: nextStatus,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/courses/builder");
  revalidatePath("/store");
  revalidatePath("/courses");
  revalidatePath(`/courses/${product.slug}`);
  return product;
}

export async function deleteProductAction(productId: string) {
  const product = await db.product.delete({
    where: { id: productId },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/courses/builder");
  revalidatePath("/store");
  revalidatePath("/courses");
  return product;
}
