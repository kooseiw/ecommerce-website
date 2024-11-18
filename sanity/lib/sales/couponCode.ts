export const COUPON_CODE = {
    BFRIDAY: "BFRIDAY"
} as const;

export type CouponCode = keyof typeof COUPON_CODE;