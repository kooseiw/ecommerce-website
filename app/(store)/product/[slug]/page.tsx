import { ImageUrl } from "@/lib/imageUrl";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "next-sanity";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 60;
export const dynamic = "force-static";

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock != null && product.stock <= 0;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${
            isOutOfStock ? "opacity-50" : ""
          }`}
        >
          {product.image && (
            <Image
              src={ImageUrl(product.image).url()}
              alt={product.name ?? "Product Image"}
              fill
              className="object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-white text-lg font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-6">
          <div className="border-b pb-4">
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <div className="text-2xl font-semibold text-primary">
              ${product.price?.toFixed(2)}
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {Array.isArray(product.description) && (
              <PortableText value={product.description} />
            )}
          </div>

          <div className="mt-6">
            <AddToCartButton product={product} disabled={isOutOfStock} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
