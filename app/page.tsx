import Link from "next/link";
import { categories, products } from "@/lib/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-xl border p-6">
        <h1 className="text-2xl font-semibold">Furniture, made easy.</h1>
        <p className="mt-2 text-muted-foreground">
          Browse categories, open a product, and add to cart. This is Milestone 1.
        </p>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold">Shop by category</h2>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`}>
              <Card className="overflow-hidden">
                <img src={c.image} alt={c.name} className="h-36 w-full object-cover" />
                <CardContent className="p-4">
                  <div className="font-medium">{c.name}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Featured</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Link key={p.slug} href={`/p/${p.slug}`}>
              <Card className="overflow-hidden">
                <img src={p.images[0]} alt={p.title} className="h-36 w-full object-cover" />
                <CardContent className="p-4">
                  <div className="line-clamp-2 font-medium">{p.title}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="font-semibold">AED {p.price}</div>
                    {p.compareAtPrice ? (
                      <Badge variant="secondary" className="line-through">
                        AED {p.compareAtPrice}
                      </Badge>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
