import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          Homecentre Clone
        </Link>

        <nav className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <Link href="/c/sofas">Shop</Link>
          </Button>
          <Button variant="outline">Cart (0)</Button>
        </nav>
      </div>
    </header>
  );
}
