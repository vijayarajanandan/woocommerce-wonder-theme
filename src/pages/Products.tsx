import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { products, categories, getSaleProducts, getProductsByCategory } from "@/data/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const showSale = searchParams.get("sale") === "true";

  let displayProducts = products;
  let pageTitle = "All Products";

  if (showSale) {
    displayProducts = getSaleProducts();
    pageTitle = "Sale";
  } else if (categorySlug) {
    displayProducts = getProductsByCategory(categorySlug);
    const category = categories.find((c) => c.slug === categorySlug);
    pageTitle = category?.name || "Products";
  }

  const clearFilters = () => setSearchParams({});

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="font-display text-3xl font-semibold">{pageTitle}</h1>
            <div className="flex flex-wrap gap-2">
              <Button variant={!categorySlug && !showSale ? "default" : "outline"} size="sm" onClick={clearFilters}>
                All
              </Button>
              {categories.slice(0, 4).map((cat) => (
                <Button
                  key={cat.id}
                  variant={categorySlug === cat.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchParams({ category: cat.slug })}
                >
                  {cat.name}
                </Button>
              ))}
              <Button
                variant={showSale ? "default" : "outline"}
                size="sm"
                className={cn(showSale && "bg-sale hover:bg-sale/90")}
                onClick={() => setSearchParams({ sale: "true" })}
              >
                Sale
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {displayProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No products found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
