"use client";

import { getDigitalProductCategory, type DigitalProductCategoryRecord } from "@/lib/admin-api";
import { DigitalProductForm } from "@/components/admin/digital-product-form";
import { useResource } from "@/components/admin/use-resource";
import { ResourceLoader } from "@/components/admin/resource-loader";

export function EditDigitalProduct({ id }: { id: string }) {
  const { data, error } = useResource<DigitalProductCategoryRecord>(id, getDigitalProductCategory, "Could not load category.");
  return (
    <ResourceLoader data={data} error={error}>
      {(category) => <DigitalProductForm existing={category} />}
    </ResourceLoader>
  );
}
