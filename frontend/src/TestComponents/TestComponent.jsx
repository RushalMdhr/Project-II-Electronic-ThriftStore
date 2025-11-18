import React from 'react';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Clock, CheckCircle, XCircle, Package, Search, Filter, Calendar, User, CreditCard, Truck, Check } from 'lucide-react';
import { toast } from "react-toastify";
import { useGetOrdersQuery, useUpdateAdminOrderStatusMutation } from "../redux/api/orderApiSlice";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  
  const { data: allOrders } = useGetOrdersQuery({
    status: statusFilter,
    paymentStatus: paymentStatusFilter,
    dateFrom,
    dateTo,
    page: currentPage,
    pageSize: 10,
  });
  
  const [updateOrder] = useUpdateAdminOrderStatusMutation();

  const takeAction = async (payload) => {
    if (!window.confirm("Are you sure you want to update this order?")) {
      return;
    }
    
    try {
      const update = await updateOrder({ payload }).unwrap();
      if (!update) {
        toast.error("Error updating order");
        return;
      }
      console.log("Response: ", update);
      toast.success(`Order updated to ${payload.action}`);
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to update order!");
    }
  };

  useEffect(() => {
    if (allOrders) {
      setOrders(allOrders.orders || []);
      setTotalPages(allOrders.totalPages || 1);
      setTotalOrders(allOrders.totalOrders || 0);
      setLoading(false);
    }
  }, [allOrders]);

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
      pending: { text: 'Pending', color: 'bg-yellow-500 text-white', icon: Clock },
      confirmed: { text: 'Confirmed', color: 'bg-blue-500 text-white', icon: CheckCircle },
      processing: { text: 'Processing', color: 'bg-indigo-500 text-white', icon: Package },
      shipped: { text: 'Shipped', color: 'bg-teal-500 text-white', icon: Truck },
      delivered: { text: 'Delivered', color: 'bg-green-500 text-white', icon: Check },
      cancelled: { text: 'Cancelled', color: 'bg-red-500 text-white', icon: XCircle },
      refunded: { text: 'Refunded', color: 'bg-gray-500 text-white', icon: XCircle }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-white">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const methodConfig = {
      cod: { text: 'COD', color: 'bg-gray-500 text-white' },
      esewa: { text: 'eSewa', color: 'bg-blue-500 text-white' }
    };
    
    const config = methodConfig[method?.toLowerCase()] || methodConfig.cod;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getActionButton = (order) => {
    if (order.status === "confirmed") {
      return (
        <button 
          onClick={() => takeAction({ orderId: order._id, action: "processing" })}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          Process
        </button>
      );
    } else if (order.status === "processing") {
      return (
        <button 
          onClick={() => takeAction({ orderId: order._id, action: "shipped" })}
          className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          Ship
        </button>
      );
    } else if (order.status === "shipped") {
      return (
        <span className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm font-medium">
          Waiting...
        </span>
      );
    } else if (order.status === "pending") {
      return (
        <button 
          onClick={() => takeAction({ orderId: order._id, action: "confirmed" })}
          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          Confirm
        </button>
      );
    } else if (order.status === "delivered" || order.status === "cancelled") {
      return (
        <span className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm font-medium">
          Completed
        </span>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-emerald-400">Manage Orders</h1>
        <p className="text-gray-300 mt-1">View and manage all customer orders</p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-300" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-gray-300" />
            <select 
              value={paymentStatusFilter} 
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Date Range Filters */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-300" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="From"
            />
            <span className="text-gray-300">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="To"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="px-6 py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr 
                    className="hover:bg-gray-800 cursor-pointer"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {formatOrderId(order._id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {order.customer?.username || 'Anonymous'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {getPaymentStatusBadge(order.payment?.status)}
                        {getPaymentMethodBadge(order.payment?.method)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getActionButton(order)}
                    </td>
                  </tr>
                  
                  {/* Expanded Order Details */}
                  {expandedOrders.has(order._id) && (
                    <tr className="bg-gray-800">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Order Items */}
                          <div>
                            <h3 className="text-lg font-semibold text-emerald-400 mb-4">Order Items</h3>
                            <div className="space-y-4">
                              {order.orderItems?.map((item) => (
                                <div 
                                  key={item._id} 
                                  className={`p-4 rounded-lg border ${
                                    item.status === "cancelled" 
                                      ? "border-red-500 bg-red-900/20" 
                                      : "border-gray-700 bg-gray-900"
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className={`font-medium text-white ${
                                        item.status === "cancelled" ? "line-through text-gray-400" : ""
                                      }`}>
                                        {item.product.name}
                                      </div>
                                      
                                      {item.status === "unavailable" && (
                                        <div className="mt-2">
                                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500 text-white">
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Unavailable
                                          </span>
                                        </div>
                                      )}
                                      
                                      {item.status === "cancelled" && (
                                        <div className="mt-2">
                                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500 text-white">
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Cancelled
                                          </span>
                                          {item.reasonForCancel && (
                                            <p className="mt-1 text-xs text-red-300 ml-2">
                                              Reason: {item.reasonForCancel}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                      
                                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-300">
                                        <span>Qty: {item.quantity}</span>
                                        <span>Price: ${item.price?.toFixed(2)}</span>
                                        <span className="font-medium text-white">
                                          Total: ${(item.quantity * item.price)?.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {/* Item Status Badge */}
                                    <div>
                                      {item.status && (
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          item.status === 'confirmed' ? 'bg-blue-500 text-white' :
                                          item.status === 'pending' ? 'bg-yellow-500 text-white' :
                                          item.status === 'cancelled' ? 'bg-red-500 text-white' :
                                          'bg-gray-500 text-white'
                                        }`}>
                                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div>
                            <h3 className="text-lg font-semibold text-emerald-400 mb-4">Order Summary</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Subtotal:</span>
                                <span className="font-medium">${order.subtotal?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Shipping:</span>
                                <span className="font-medium">${order.shipping?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Tax:</span>
                                <span className="font-medium">${order.tax?.toFixed(2)}</span>
                              </div>
                              <div className="border-t border-gray-700 pt-3">
                                <div className="flex justify-between text-base font-bold">
                                  <span>Total:</span>
                                  <span className="text-emerald-400">${order.total?.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-400">
                                  Order ID: {order._id}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                                <span>Created: {formatDate(order.createdAt)}</span>
                                <span>Updated: {formatDate(order.updatedAt)}</span>
                              </div>
                              <div className="mt-2">
                                <span className="text-xs text-gray-400">Customer: {order.customer?.email}</span>
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

        {/* Pagination */}
        {totalOrders > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-300">
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalOrders)} of {totalOrders} orders
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage - 2 + i;
                if (pageNum < 1 || pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      pageNum === currentPage 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
