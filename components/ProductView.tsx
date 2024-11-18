import { Product, Category } from "@/sanity.types";
import ProductGrid from "./ProductGrid";
    
type ProductsViewProps = {
    products: Product[];
    categories: Category[];
}

const ProductsView = ({ products, categories }: ProductsViewProps) => {
    return(
        <div className="flex flex-col sm:flex-row">
            {/* categories */}
            <div className="flex-1">
                {/* <CategorySelectorComponent categories={categories} /> */}
            </div>

            {/* products */}
            <div className="flex flex-col items-center">
                <div>
                    <ProductGrid products={products} />
                    <hr className="w-1/2 sm:3/4" />
                </div>
            </div>
        </div>
    );
}

export default ProductsView;