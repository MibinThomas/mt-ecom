import Link from "next/link";
import { getCategory, getProductsByCategory } from "@/lib/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) return <div className="p-6">Category not found.</div>;

  const items = getProductsByCategory(category.slug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{category.name}</h1>
          <p className="mt-1 text-muted-foreground">{items.length} products</p>
        </div>

        <div className="w-56">
          <Select defaultValue="featured">
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <Link key={p.slug} href={`/p/${p.slug}`}>
            <Card className="overflow-hidden">
              <img src={p.images[0]} alt={p.title} className="h-40 w-full object-cover" />
              <CardContent className="p-4">
                <div className="line-clamp-2 font-medium">{p.title}</div>
                <div className="mt-2 font-semibold">AED {p.price}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
