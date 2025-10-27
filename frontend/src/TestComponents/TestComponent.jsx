import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Package, CreditCard, Wallet, CheckCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

const CustomerOrderDashboard = () => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('esewa');

  // Mock order data based on your schema
  const orders = [
    {
      _id: { $oid: "68fdfa67c812aba07f3565e5" },
      customer: { $oid: "68c422250574d5174e268bf0" },
      orderItems: [
        {
          product: { $oid: "68ede13402daf0dd8254129a" },
          vendor: { $oid: "68c191c0589f51d09d7d2ddb" },
          quantity: 1,
          price: 20000,
          _id: { $oid: "68fdfa67c812aba07f3565e6" }
        }
      ],
      subtotal: 20000,
      shipping: 100,
      tax: 2600,
      total: 22700,
      status: "pending",
      payment: {
        method: "esewa",
        status: "pending"
      },
      createdAt: { $date: "2025-10-26T10:39:35.922Z" },
      updatedAt: { $date: "2025-10-26T10:39:35.922Z" },
      __v: 0
    },
    {
      _id: { $oid: "68fdfa67c812aba07f3565e7" },
      customer: { $oid: "68c422250574d5174e268bf0" },
      orderItems: [
        {
          product: { $oid: "68ede13402daf0dd8254129b" },
          vendor: { $oid: "68c191c0589f51d09d7d2ddb" },
          quantity: 2,
          price: 15000,
          _id: { $oid: "68fdfa67c812aba07f3565e8" }
        }
      ],
      subtotal: 30000,
      shipping: 200,
      tax: 3900,
      total: 34100,
      status: "accepted",
      payment: {
        method: "cod",
        status: "pending"
      },
      createdAt: { $date: "2025-10-25T08:15:22.345Z" },
      updatedAt: { $date: "2025-10-25T08:15:22.345Z" },
      __v: 0
    },
    {
      _id: { $oid: "68fdfa67c812aba07f3565e9" },
      customer: { $oid: "68c422250574d5174e268bf0" },
      orderItems: [
        {
          product: { $oid: "68ede13402daf0dd8254129c" },
          vendor: { $oid: "68c191c0589f51d09d7d2ddb" },
          quantity: 1,
          price: 8500,
          _id: { $oid: "68fdfa67c812aba07f3565ea" }
        }
      ],
      subtotal: 8500,
      shipping: 150,
      tax: 1105,
      total: 9755,
      status: "delivered",
      payment: {
        method: "esewa",
        status: "paid"
      },
      createdAt: { $date: "2025-10-24T14:30:18.789Z" },
      updatedAt: { $date: "2025-10-24T14:30:18.789Z" },
      __v: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'esewa': return <Wallet className="h-5 w-5" />;
      case 'cod': return <CreditCard className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your order status and details</p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <React.Fragment key={order._id.$oid}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt.$date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Product {index + 1} (Qty: {order.orderItems[0].quantity})
                            </div>
                            <button 
                              onClick={() => toggleExpand(order._id.$oid)}
                              className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                            >
                              {expandedOrderId === order._id.$oid ? (
                                <>
                                  <ChevronUp className="h-4 w-4" /> Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4" /> View Details
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {getPaymentIcon(order.payment.method)}
                          <span>{order.payment.method.toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.payment.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Order Details */}
                    {expandedOrderId === order._id.$oid && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="px-6 py-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium text-gray-700">Order ID:</p>
                                    <p className="text-gray-900">{order._id.$oid}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Total Amount:</p>
                                    <p className="text-gray-900">{formatCurrency(order.total)}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Created:</p>
                                    <p className="text-gray-900">{formatDate(order.createdAt.$date)}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <select 
                                  value={paymentMethod}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="esewa">Esewa</option>
                                  <option value="cod">Cash on Delivery</option>
                                  <option value="credit">Credit Card</option>
                                </select>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                  Update Payment
                                </button>
                              </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4">
                              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                              <div className="space-y-3">
                                {order.orderItems.map((item, itemIndex) => (
                                  <div key={item._id.$oid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Package className="h-5 w-5 text-gray-600" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">Product {itemIndex + 1}</div>
                                        <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                      </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {formatCurrency(item.price * item.quantity)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 mt-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Subtotal:</p>
                                  <p className="text-sm text-gray-900">{formatCurrency(order.subtotal)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Shipping:</p>
                                  <p className="text-sm text-gray-900">{formatCurrency(order.shipping)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Tax:</p>
                                  <p className="text-sm text-gray-900">{formatCurrency(order.tax)}</p>
                                </div>
                              </div>
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                  <p className="text-lg font-semibold text-gray-900">Total:</p>
                                  <p className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDashboard;
