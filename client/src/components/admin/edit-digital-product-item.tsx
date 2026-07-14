"use client";

import { getDigitalProduct, type DigitalProductRecord } from "@/lib/admin-api";
import { DigitalProductItemForm } from "@/components/admin/digital-product-item-form";
import { useResource } from "@/components/admin/use-resource";
import { ResourceLoader } from "@/components/admin/resource-loader";

export function EditDigitalProductItem({ categoryId, id }: { categoryId: string; id: string }) {
  const { data, error } = useResource<DigitalProductRecord>(id, getDigitalProduct, "Could not load product.");
  return (
    <ResourceLoader data={data} error={error}>
      {(product) => <DigitalProductItemForm categoryId={categoryId} existing={product} />}
    </ResourceLoader>
  );
}
