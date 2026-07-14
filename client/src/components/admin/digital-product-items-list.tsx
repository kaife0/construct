"use client";

import { useEffect, useState } from "react";
import {
  listDigitalProducts,
  deleteDigitalProduct,
  getDigitalProductCategory,
  type DigitalProductRecord,
} from "@/lib/admin-api";
import { AdminResourceList } from "@/components/admin/admin-resource-list";

export function DigitalProductItemsList({ categoryId }: { categoryId: string }) {
  const [categoryTitle, setCategoryTitle] = useState<string | null>(null);

  useEffect(() => {
    getDigitalProductCategory(categoryId).then((c) => setCategoryTitle(c.title));
  }, [categoryId]);

  return (
    <AdminResourceList<DigitalProductRecord>
      title={categoryTitle ? `${categoryTitle} — Products` : "Products"}
      newHref={`/admin/digital-products/${categoryId}/products/new`}
      newLabel="New product"
      emptyLabel="No products yet. Create your first one."
      list={() => listDigitalProducts(categoryId)}
      remove={deleteDigitalProduct}
      editHref={(p) => `/admin/digital-products/${categoryId}/products/${p._id}/edit`}
      getId={(p) => p._id}
      getImage={(p) => p.image}
      getTitle={(p) => p.title}
      renderSubtitle={(p) => (p.price ? `₹${p.price.toLocaleString("en-IN")}` : "No price set")}
      backHref="/admin/digital-products"
      backLabel="Digital Products"
    />
  );
}
