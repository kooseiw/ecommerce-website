import { Product, Category } from "@/sanity.types";
import ProductGrid from "./ProductGrid";
import { CategorySelectorComponent } from "./ui/category-selector";

type ProductsViewProps = {
  products: Product[];
  categories: Category[];
};

const ProductsView = ({ products, categories }: ProductsViewProps) => {
  return (
    <div className="w-full px-4">
      {/* Filter Categories */}
      <div className="w-[200px] mb-6">
        <CategorySelectorComponent categories={categories} />
      </div>

      {/* Products Grid */}
      <div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default ProductsView;
