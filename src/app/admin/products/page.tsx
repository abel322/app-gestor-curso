import { db } from "@/lib/prisma";
import ProductCatalogClient from "./ProductCatalogClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedProducts = products.map((product) => ({
    ...product,
    createdAt: product.createdAt.toISOString().split("T")[0],
    updatedAt: product.updatedAt.toISOString().split("T")[0],
  }));

  return <ProductCatalogClient initialProducts={serializedProducts} />;
}
