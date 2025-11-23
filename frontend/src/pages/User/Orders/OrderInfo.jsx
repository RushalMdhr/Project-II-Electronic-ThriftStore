    import { useEffect } from "react";
    import { useParams, useNavigate } from "react-router-dom";
    import { useGetOrderByIdQuery } from "../../../redux/api/orderApiSlice";
    import { toast } from "react-toastify";

    const OrderInfo = () => {
    const { id } = useParams(); // order ID from URL
    const navigate = useNavigate();

    const { data: order, isLoading, isError } = useGetOrderByIdQuery(id);

    useEffect(() => {
        if (isError) {
        toast.error("Failed to fetch order details");
        }
    }, [isError]);

    if (isLoading) return <div>🔄 Loading order details...</div>;
    if (!order) return <div>⚠️ Order not found</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto border rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Order #{order._id}</h1>
        <p>
            <strong>Status:</strong> {order.payment?.status || "Pending"}
        </p>
        <p>
            <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
        <p>
            <strong>Shipping:</strong> ${order.shipping.toFixed(2)}
        </p>
        <p>
            <strong>Tax:</strong> ${order.tax.toFixed(2)}
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Items</h2>
        <ul className="space-y-2">
            {order.orderItems.map((item, index) => (
            <li
                key={index}
                className="flex items-center gap-4 border p-2 rounded"
            >
                <img
                src={item.product?.images?.[0] || "/placeholder.png"}
                alt={item.product?.name || item.name}
                className="w-16 h-16 object-cover rounded"
                />
                <div>
                <p className="font-semibold">{item.product?.name || item.name}</p>
                <p>
                    Price: ${item.price.toFixed(2)} × {item.quantity} = $
                    {(item.price * item.quantity).toFixed(2)}
                </p>
                {item.tax && <p>Tax: ${item.tax.toFixed(2)}</p>}
                </div>
            </li>
            ))}
        </ul>

        <button
            onClick={() => navigate("/myorders")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Back to My Orders
        </button>
        </div>
    );
    };

    export default OrderInfo;
