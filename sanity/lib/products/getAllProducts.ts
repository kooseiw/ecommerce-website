import { sanityFetch } from "../live";
import { defineQuery } from "next-sanity";

export const getAllProducts = async () => {
    const ALL_PRODUCTS_QUERY = defineQuery(`
        *[
            _type == "product"
        ] | order(name asc)
    `)

    try {
        const products = await sanityFetch({
            query: ALL_PRODUCTS_QUERY,
        })

        return products.data || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
