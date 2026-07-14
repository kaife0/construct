"use client";

import { listDigitalProductCategories, deleteDigitalProductCategory, type DigitalProductCategoryRecord } from "@/lib/admin-api";
import { AdminResourceList } from "@/components/admin/admin-resource-list";

export function DigitalProductsList() {
  return (
    <AdminResourceList<DigitalProductCategoryRecord>
      title="Digital Products"
      newHref="/admin/digital-products/new"
      newLabel="New category"
      emptyLabel="No categories yet. Create your first one."
      list={listDigitalProductCategories}
      remove={deleteDigitalProductCategory}
      editHref={(c) => `/admin/digital-products/${c._id}/edit`}
      getId={(c) => c._id}
      getImage={(c) => c.image}
      getTitle={(c) => c.title}
      renderSubtitle={(c) => (
        <>
          {c.summary}
          {c.showPlansCatalog && <span className="label ml-2 text-[9px] text-accent-strong">SHOWS PLANS</span>}
        </>
      )}
      extraAction={(c) =>
        c.showPlansCatalog
          ? { href: "/admin/plans", label: "Manage plans →" }
          : { href: `/admin/digital-products/${c._id}/products`, label: "Manage products →" }
      }
    />
  );
}
