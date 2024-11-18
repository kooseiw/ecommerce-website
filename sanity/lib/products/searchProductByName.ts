import { defineQuery } from "next-sanity"

export const searchProductByName = async (searchParam: string) => {
    const PRODUCT_BY_NAME_QUERY = defineQuery(`
        *[_type == "product" && name match $searchParam] | order(name asc)
    `)
}