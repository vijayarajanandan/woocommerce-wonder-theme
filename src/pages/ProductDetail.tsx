import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, Minus, Plus, Star } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { getProductBySlug } from "@/data/products";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl mb-4">Product not found</h1>
            <Button asChild><Link to="/products">Back to Products</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.regularPrice
    ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity, undefined, selectedAttributes);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Products
          </Link>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === i ? "border-primary" : "border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.onSale && <Badge className="bg-sale text-sale-foreground">-{discount}%</Badge>}
                {product.stockStatus === "outofstock" && <Badge variant="destructive">Out of Stock</Badge>}
              </div>
              <h1 className="font-display text-3xl font-semibold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm">{product.averageRating} ({product.reviewCount} reviews)</span>
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-semibold">${product.price.toLocaleString()}</span>
                {product.regularPrice && <span className="text-lg text-muted-foreground line-through">${product.regularPrice.toLocaleString()}</span>}
              </div>
              <p className="mt-6 text-muted-foreground">{product.description}</p>
              {/* Attributes */}
              {product.attributes?.map((attr) => (
                <div key={attr.name} className="mt-6">
                  <label className="text-sm font-medium">{attr.name}</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {attr.options.map((opt) => (
                      <Button key={opt} variant={selectedAttributes[attr.name] === opt ? "default" : "outline"} size="sm" onClick={() => setSelectedAttributes((prev) => ({ ...prev, [attr.name]: opt }))}>
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              {/* Quantity & Add to Cart */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center border border-border rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => q + 1)}><Plus className="h-4 w-4" /></Button>
                </div>
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stockStatus === "outofstock"}>
                  Add to Cart
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
