/* eslint-disable */
import ProductGrid from "@/components/ProductGrid";
import { searchProductByName } from "@/sanity/lib/products/searchProductByName";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: any;
}): Promise<JSX.Element> {
  const query = (searchParams?.query as string) || "";
  const products = await searchProductByName(query);

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            No products found for: {query}
          </h1>
          <p className="text-center text-gray-600">
            Try searching for something else.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Search Results for <span className="text-blue-500">{query}</span>
        </h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
