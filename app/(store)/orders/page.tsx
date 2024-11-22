import { formatCurrency } from "@/lib/formatCurrency";
import { ImageUrl } from "@/lib/imageUrl";
import { getMyOrders } from "@/sanity/lib/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

async function Orders() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const orders = await getMyOrders(userId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-5xl mx-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              You have not placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order ID</p>
                      <p className="font-mono text-sm text-green-600 break-all">
                        {order._id}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-medium">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Status:</span>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="font-bold text-xl text-gray-900">
                        {formatCurrency(order.totalPrice ?? 0, order.currency)}
                      </p>
                    </div>
                  </div>

                  {order.amountDiscount ? (
                    <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-red-700 mb-1 font-semibold">
                        Discount:{" "}
                        {formatCurrency(order.amountDiscount, order.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Original Subtotal:{" "}
                        {formatCurrency(
                          (order.totalPrice ?? 0) + order.amountDiscount,
                          order.currency
                        )}
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-gray-900 font-medium mb-4">
                      Product Details
                    </p>
                    <div className="space-y-4">
                      {order.products?.map((product, index) => (
                        <div
                          key={`${order._id}-${product.product?._id}-${index}`}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b last:border-b-0"
                        >
                          <div className="flex items-center gap-4">
                            {product.product?.image && (
                              <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                                <Image
                                  src={ImageUrl(product.product.image).url()}
                                  alt={product.product?.name ?? ""}
                                  className="object-cover"
                                  fill
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-gray-900 mb-1">
                                {product.product?.name}
                              </p>
                              <p className="text-sm font-semibold text-gray-600">
                                Quantity: {product.quantity ?? "N/A"}
                              </p>
                            </div>
                          </div>

                          <p className="font-bold text-right text-gray-900">
                            {product.product?.price && product.quantity
                              ? formatCurrency(
                                  product.product.price * product.quantity,
                                  order.currency
                                )
                              : "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
