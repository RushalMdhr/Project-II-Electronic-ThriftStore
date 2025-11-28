import { useState } from "react";
import { useGetPendingPaymentVendorsQuery } from "../../redux/api/usersApiSlice";
import { CreditCard, User, MapPin, Calendar } from "lucide-react";
import { formatDate } from "../../components/IdShorter";

// Dark, premium emerald palette - matching the existing admin theme
const COLORS = {
  emerald: "#009966",
  teal: "#23605C",
  slate: "#1E2939",
  black: "#101828",
  surface: "rgba(255,255,255,0.03)",
};

const VendorPayments = () => {
  const { data: pendingPaymentVendors, isLoading, error } = useGetPendingPaymentVendorsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter vendors based on search term
  const filteredVendors = pendingPaymentVendors?.filter(vendor =>
    vendor.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const currentVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleProcessPayment = (vendorId) => {
    // In a real implementation, this would call a mutation to process payment
    alert(`Processing payment for vendor ${vendorId}`);
  };



  if (isLoading) {
    return (
      <div
        style={{ background: COLORS.black }}
        className="min-h-screen p-6 text-white font-sans flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading vendor payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ background: COLORS.black }}
        className="min-h-screen p-6 text-white font-sans flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <h3 className="mt-4 text-lg font-medium">Failed to load vendor payments</h3>
          <p className="mt-2 text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ background: COLORS.black }}
      className="min-h-screen p-6 text-white font-sans"
    >
      <style>{`
        .card { 
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); 
          border: 1px solid rgba(255,255,255,0.04); 
        }
        .vendor-row:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 24px rgba(2,6,23,0.5); 
          border-color: rgba(255,255,255,0.08);
        }
        .status-active { 
          background: rgba(76, 175, 80, 0.15); 
          color: #4CAF50; 
          padding: 4px 8px; 
          border-radius: 999px; 
          font-weight: 600;
          font-size: 12px;
        }
        .status-inactive { 
          background: rgba(244, 67, 54, 0.15); 
          color: #F44336; 
          padding: 4px 8px; 
          border-radius: 999px; 
          font-weight: 600;
          font-size: 12px;
        }
      `}</style>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vendor Payments</h1>
          <p className="text-gray-400 mt-1">
            Manage pending payments to vendors for delivered orders
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-emerald-400">
            {pendingPaymentVendors?.reduce((sum, vendor) => sum + (vendor.income?.pending || 0), 0).toLocaleString()} NPR
          </div>
          <div className="text-sm text-gray-400">Total pending payments</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search vendors by shop name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Vendors</p>
              <p className="text-2xl font-bold">{pendingPaymentVendors?.length || 0}</p>
            </div>
            <User className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <div className="card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-emerald-400">
                {pendingPaymentVendors?.reduce((sum, vendor) => sum + (vendor.income?.pending || 0), 0).toLocaleString()} NPR
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Vendor Payments Table */}
      <div className="card rounded-xl overflow-hidden">
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-300">No vendors found</h3>
            <p className="mt-2 text-gray-400">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead style={{ background: COLORS.surface }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Shop</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Pending Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Last Paid</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {currentVendors.map((vendor) => (
                    <tr key={vendor._id} className="vendor-row transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{vendor.username}</div>
                        <div className="text-sm text-gray-400">{vendor.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{vendor.shopName}</div>
                        <div className={vendor.status === "active" ? "status-active" : "status-inactive"}>
                          {vendor.status?.charAt(0).toUpperCase() + vendor.status?.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-300">
                          <MapPin className="w-4 h-4 mr-1" />
                          {vendor.shippingAddress?.city}, {vendor.shippingAddress?.district || vendor.shippingAddress?.provience}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-emerald-400">
                          {(vendor.income?.pending || 0).toLocaleString()} NPR
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(vendor.income?.lastPaid)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleProcessPayment(vendor._id)}
                          className="px-4 py-2 rounded-md font-semibold text-sm"
                          style={{ background: COLORS.emerald, color: "#061114" }}
                        >
                          Process Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === 1 
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                        : 'bg-gray-800 text-white hover:bg-gray-700'
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
                            : 'bg-gray-800 text-white hover:bg-gray-700'
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
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VendorPayments;
