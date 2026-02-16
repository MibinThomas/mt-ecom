import { getProduct } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) return <div className="p-6">Product not found.</div>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <img
            src={product.images[0]}
            alt={product.title}
            className="aspect-[5/4] w-full rounded-xl border object-cover"
          />
          <div className="grid grid-cols-3 gap-3">
            {product.images.slice(0, 3).map((img) => (
              <img key={img} src={img} alt="" className="aspect-[5/4] w-full rounded-lg border object-cover" />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{product.title}</h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="text-xl font-semibold">AED {product.price}</div>
            {product.compareAtPrice ? (
              <Badge variant="secondary" className="line-through">
                AED {product.compareAtPrice}
              </Badge>
            ) : null}
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            {product.options.map((opt) => (
              <div key={opt.name}>
                <div className="text-sm font-medium">{opt.name}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {opt.values.map((v) => (
                    <button
                      key={v}
                      className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                      type="button"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                // Milestone 1: fake add to cart
                console.log("Add to cart:", product.slug);
              }}
            >
              Add to Cart
            </Button>
            <Button variant="outline">Buy Now</Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Milestone 1 uses dummy data. In Milestone 2 we will connect Prisma + Postgres and make cart real.
          </p>
        </div>
      </div>
    </main>
  );
}
