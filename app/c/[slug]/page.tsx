import Link from "next/link";
import { getCategory, getProductsByCategory, getAvailableOptionFilters } from "@/lib/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type SP = {
  sort?: string;
  min?: string;
  max?: string;
  instock?: string; // "1"
  // option filters come like: opt_Color=Grey,Blue
  [key: string]: string | undefined;
};

function parseNum(v: string | undefined) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseMulti(v: string | undefined) {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => decodeURIComponent(s.trim()))
    .filter(Boolean);
}

function buildQuery(current: SP, updates: Partial<SP>) {
  const next: Record<string, string> = {};

  // keep existing
  for (const [k, v] of Object.entries(current)) {
    if (!v) continue;
    next[k] = v;
  }

  // apply updates
  for (const [k, v] of Object.entries(updates)) {
    if (!v) delete next[k];
    else next[k] = v;
  }

  const qs = new URLSearchParams(next).toString();
  return qs ? `?${qs}` : "";
}

function toggleValue(currentCsv: string | undefined, value: string) {
  const arr = parseMulti(currentCsv);
  const exists = arr.includes(value);
  const next = exists ? arr.filter((x) => x !== value) : [...arr, value];
  return next.length ? next.map(encodeURIComponent).join(",") : undefined;
}



export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SP>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  console.log("SLUG:", slug);

  const category = getCategory(slug);
  if (!category) return <div className="p-6">Category not found.</div>;


  const sort = searchParams.sort ?? "featured";
  const min = parseNum(searchParams.min);
  const max = parseNum(searchParams.max);
  const inStock = searchParams.instock === "1";

  let items = getProductsByCategory(category.slug);

  // --- Apply option filters from URL
  const optionFilters = getAvailableOptionFilters(category.slug);

  // Build selected options map from searchParams keys like opt_Color
  const selected: Record<string, string[]> = {};
  for (const key of Object.keys(searchParams)) {
    if (!key.startsWith("opt_")) continue;
    const optName = key.replace("opt_", "");
    selected[optName] = parseMulti(searchParams[key]);
  }

  items = items.filter((p) => {
    // price filter
    if (min !== null && p.price < min) return false;
    if (max !== null && p.price > max) return false;

    // stock filter (dummy true for now)
    if (inStock) {
      // later: check variant stock
      // for now do nothing (all true)
    }

    // option filters: if user selected values for an option, product must match at least one
    for (const [optName, values] of Object.entries(selected)) {
      if (!values.length) continue;
      const productOpt = p.options.find((o) => o.name === optName);
      if (!productOpt) return false;
      const matches = productOpt.values.some((v) => values.includes(v));
      if (!matches) return false;
    }

    return true;
  });

  // --- Sorting
  if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);

  const activeFilterCount = (() => {
    let n = 0;
    if (min !== null) n++;
    if (max !== null) n++;
    if (inStock) n++;
    for (const vals of Object.values(selected)) n += vals.length;
    return n;
  })();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{category.name}</h1>
          <p className="mt-1 text-muted-foreground">{items.length} products</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            {activeFilterCount ? (
              <Badge variant="secondary">{activeFilterCount} filters</Badge>
            ) : (
              <span>No filters</span>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={buildQuery(searchParams, { sort: "featured" })} className="text-sm underline">
              Featured
            </Link>
            <Link href={buildQuery(searchParams, { sort: "price-asc" })} className="text-sm underline">
              Price ↑
            </Link>
            <Link href={buildQuery(searchParams, { sort: "price-desc" })} className="text-sm underline">
              Price ↓
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* SIDEBAR */}
        <aside className="h-fit rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Filters</div>
            <Link href={`/c/${category.slug}`} className="text-sm underline">
              Clear
            </Link>
          </div>

          <Separator className="my-4" />

          {/* Price */}
          <div>
            <div className="text-sm font-medium">Price (AED)</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                href={buildQuery(searchParams, { min: "0", max: "999" })}
              >
                0–999
              </Link>
              <Link
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                href={buildQuery(searchParams, { min: "1000", max: "1999" })}
              >
                1000–1999
              </Link>
              <Link
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                href={buildQuery(searchParams, { min: "2000", max: "999999" })}
              >
                2000+
              </Link>
              <Link
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                href={buildQuery(searchParams, { min: undefined, max: undefined })}
              >
                Any
              </Link>
            </div>
          </div>

          <Separator className="my-4" />

          {/* In Stock */}
          <div>
            <div className="text-sm font-medium">Availability</div>
            <div className="mt-3">
              <Link
                href={buildQuery(searchParams, { instock: inStock ? undefined : "1" })}
                className="flex items-center gap-2 text-sm"
              >
                <span className={`h-4 w-4 rounded border ${inStock ? "bg-foreground" : ""}`} />
                In stock only
              </Link>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Options (Color/Material/Size etc.) */}
          <div className="space-y-5">
            {optionFilters.map((opt) => {
              const key = `opt_${opt.name}`;
              const selectedCsv = searchParams[key];
              const selectedVals = parseMulti(selectedCsv);

              return (
                <div key={opt.name}>
                  <div className="text-sm font-medium">{opt.name}</div>
                  <div className="mt-2 space-y-2">
                    {opt.values.map((v) => {
                      const isActive = selectedVals.includes(v);
                      const nextCsv = toggleValue(selectedCsv, v);

                      return (
                        <Link
                          key={v}
                          href={buildQuery(searchParams, { [key]: nextCsv })}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className={`h-4 w-4 rounded border ${isActive ? "bg-foreground" : ""}`} />
                          <span>{v}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <Link key={p.slug} href={`/p/${p.slug}`}>
                <Card className="overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="h-44 w-full object-cover" />
                  <CardContent className="p-4">
                    <div className="line-clamp-2 font-medium">{p.title}</div>
                    <div className="mt-2 font-semibold">AED {p.price}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {!items.length ? (
            <div className="mt-10 rounded-xl border p-6 text-sm text-muted-foreground">
              No products match your filters.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}


