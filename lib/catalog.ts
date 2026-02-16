export type Category = {
  slug: string;
  name: string;
  image: string;
};

export type Product = {
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  categorySlug: string;
  images: string[];
  options: {
    name: string;
    values: string[];
  }[];
};

export const categories = [
  { slug: "sofas", name: "Sofas", image: "https://picsum.photos/seed/sofa/800/500" },
  { slug: "beds", name: "Beds", image: "https://picsum.photos/seed/bed/800/500" },
  { slug: "dining", name: "Dining", image: "https://picsum.photos/seed/dining/800/500" },
  { slug: "storage", name: "Storage", image: "https://picsum.photos/seed/storage/800/500" },
];


export const products: Product[] = [
  {
    slug: "oslo-3-seater-sofa",
    title: "Oslo 3 Seater Sofa",
    price: 1899,
    compareAtPrice: 2199,
    categorySlug: "sofas",
    images: [
      "https://picsum.photos/seed/oslo1/1000/800",
      "https://picsum.photos/seed/oslo2/1000/800",
      "https://picsum.photos/seed/oslo3/1000/800",
    ],
    options: [
      { name: "Color", values: ["Grey", "Beige", "Blue"] },
      { name: "Size", values: ["3 Seater"] },
    ],
  },
  {
    slug: "nordic-queen-bed",
    title: "Nordic Queen Bed",
    price: 1599,
    categorySlug: "beds",
    images: [
      "https://picsum.photos/seed/bed1/1000/800",
      "https://picsum.photos/seed/bed2/1000/800",
    ],
    options: [{ name: "Size", values: ["Queen", "King"] }],
  },
  {
    slug: "cairo-6-seater-dining",
    title: "Cairo 6 Seater Dining Set",
    price: 2499,
    categorySlug: "dining",
    images: [
      "https://picsum.photos/seed/din1/1000/800",
      "https://picsum.photos/seed/din2/1000/800",
    ],
    options: [{ name: "Material", values: ["Wood", "Marble Top"] }],
  },
  {
    slug: "metro-3-drawer-chest",
    title: "Metro 3 Drawer Chest",
    price: 699,
    categorySlug: "storage",
    images: [
      "https://picsum.photos/seed/st1/1000/800",
      "https://picsum.photos/seed/st2/1000/800",
    ],
    options: [{ name: "Color", values: ["Oak", "Walnut"] }],
  },
];

export function getCategory(slug?: string) {
  const clean = (slug ?? "").trim().toLowerCase();
  if (!clean) return null;
  return categories.find((c) => (c.slug ?? "").trim().toLowerCase() === clean) ?? null;
}

export function getProduct(slug?: string) {
  const clean = (slug ?? "").trim().toLowerCase();
  if (!clean) return null;
  return products.find((p) => (p.slug ?? "").trim().toLowerCase() === clean) ?? null;
}



export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getAvailableOptionFilters(categorySlug: string) {
  const items = getProductsByCategory(categorySlug);

  const map = new Map<string, Set<string>>();

  for (const p of items) {
    for (const opt of p.options) {
      if (!map.has(opt.name)) map.set(opt.name, new Set());
      const set = map.get(opt.name)!;
      for (const v of opt.values) set.add(v);
    }
  }

  // Convert to array shape for UI
  return Array.from(map.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values).sort(),
  }));
}

/**
 * For milestone: fake stock availability
 * Later, this comes from Variant stock in DB.
 */
export function isInStock(_productSlug: string) {
  return true;
}
