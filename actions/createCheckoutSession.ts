'use server';

import { ImageUrl } from "@/lib/imageUrl";
import stripe from "@/lib/stripe";
import { CartItem } from "@/store/store";

export type Metadata = {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId: string;
};

export type GroupedCartItem = {
    product: CartItem["product"];
    quantity: number;
};

export async function createCheckoutSession(
    items: GroupedCartItem[],
    metadata: Metadata
) {
    try {
        const itemWithoutPrice = items.filter((item) => !item.product.price);
        if (itemWithoutPrice.length > 0) {
            throw new Error("Item is missing price");
        }

        const customers = await stripe.customers.list({
            email: metadata.customerEmail,
            limit: 1,
        });

        let customerId: string | undefined;
        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            customer_creation: customerId ? undefined : "always",
            customer_email: !customerId ? metadata.customerEmail : undefined,
            metadata,
            mode: "payment",
            allow_promotion_codes: true,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
            line_items: items.map((item) => ({
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(item.product.price! * 100),
                    product_data: {
                        name: item.product.name || "Unnamed Product",
                        description: `Product ${item.product._id}`,
                        metadata: {
                            productId: item.product._id,
                        },
                        images: item.product.image ? [ImageUrl(item.product.image).url()] : undefined,
                    },
                },
                quantity: item.quantity,
            })),
        });

        return session.url;
    } catch (error) {
        console.error("Error creating checkout session", error);
        throw error;
    }
}
