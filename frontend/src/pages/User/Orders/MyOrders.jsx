import { useGetMyOrdersQuery } from "../../../redux/api/orderApiSlice";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { useState } from "react";

const MyOrders = () => {
  const { data: myOrders = [], isLoading, isError, refetch } = useGetMyOrdersQuery();
  
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const toggleOrder = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatOrderId = (id) => {
    return id?.substring(0, 6).toUpperCase() || 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[date.getMonth()]}-${String(date.getDate()).padStart(2, '0')},${date.getFullYear()}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { text: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      shipped: { text: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Package },
      delivered: { text: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
      returned: { text: 'Returned', color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">Failed to load orders</p>
          <button 
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">View your order history and track shipments</p>
          </div>
          
          {myOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-2 text-gray-600">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {myOrders.map((myOrder) => (
                <div key={myOrder._id} className="group">
                  {/* Order Header - Clickable */}
                  <div 
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleOrder(myOrder._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {formatOrderId(myOrder._id)}
                          </span>
                          {getStatusBadge(myOrder.status)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(myOrder.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-gray-600">Payment: </span>
                          {myOrder.payment.method} {getPaymentStatusBadge(myOrder.payment?.status)}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${myOrder.total?.toFixed(2)}
                        </div>
                        <button className="p-1 rounded-full group-hover:bg-gray-100 transition-colors">
                          {expandedOrders.has(myOrder._id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Details - Collapsible */}
                  {expandedOrders.has(myOrder._id) && (
                    <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Items */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                          <div className="space-y-4">
                            {myOrder.orderItems?.map((item) => (
                              <div 
                                key={item._id} 
                                className={`p-4 rounded-lg border ${
                                  item.status === "cancelled" 
                                    ? "border-red-200 bg-red-50 opacity-75" 
                                    : "border-gray-200 bg-white"
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <Link 
                                      to={`/overview/${item.product._id}`}
                                      className={`font-medium text-gray-900 hover:text-emerald-600 transition-colors ${
                                        item.status === "cancelled" ? "line-through text-gray-500" : ""
                                      }`}
                                    >
                                      {item.product.name}
                                    </Link>
                                    
                                    {item.status === "unavailable" && (
                                      <div className="mt-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                                          <XCircle className="w-3 h-3 mr-1" />
                                          Unavailable
                                        </span>
                                      </div>
                                    )}
                                    
                                    {item.status === "cancelled" && (
                                      <div className="mt-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                                          <XCircle className="w-3 h-3 mr-1" />
                                          Cancelled
                                        </span>
                                        {item.reasonForCancel && (
                                          <p className="mt-1 text-xs text-red-600 ml-2">
                                            Reason: {item.reasonForCancel}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    
                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                                      <span>Qty: {item.quantity}</span>
                                      <span>Price: ${item.price?.toFixed(2)}</span>
                                      <span className="font-medium text-gray-900">
                                        Total: ${(item.quantity * item.price)?.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-medium">${myOrder.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Shipping:</span>
                              <span className="font-medium">${myOrder.shipping?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Tax:</span>
                              <span className="font-medium">${myOrder.tax?.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                              <div className="flex justify-between text-base font-bold">
                                <span>Total:</span>
                                <span className="text-emerald-600">${myOrder.total?.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <span className="text-sm font-medium text-emerald-700">
                                Order ID: {myOrder._id}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-emerald-600">
                              Placed on {formatDate(myOrder.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
