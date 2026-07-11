/** Thin technical spec strip under the navbar. */
export function SpecBar() {
  return (
    <div className="border-b border-line">
      <div className="container-x flex items-center justify-between gap-4 overflow-x-auto py-2.5">
        <div className="flex items-center gap-6 whitespace-nowrap">
          <span className="label">EST. 2010</span>
          <span className="label hidden sm:inline">RCC · Steel · Interiors</span>
          <span className="label hidden md:inline">Residential · Commercial</span>
        </div>
        <span className="label whitespace-nowrap text-accent-strong">● Available for new projects</span>
      </div>
    </div>
  );
}
