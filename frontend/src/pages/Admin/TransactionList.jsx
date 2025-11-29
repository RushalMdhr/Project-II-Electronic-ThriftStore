import { useState } from "react";
import { useGetEsewaPaymentsQuery } from "../../redux/api/transactionApiSlice";
import { toast } from "react-toastify";
import { Search, Calendar, CreditCard, Package, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import { formatDateWithTime } from "../../components/IdShorter";

// Dark, premium emerald palette - matching the existing admin theme
const COLORS = {
  emerald: "#009966",
  teal: "#23605C",
  slate: "#1E2939",
  black: "#101828",
  surface: "rgba(255,255,255,0.03)",
};

const TransactionHistoryAdmin = () => {
  const [filter, setFilter] = useState({
    orderId: "",
    dateFrom: "",
    dateTo: "",
    page: 1,
    pageSize: 10,
  });
  filter && console.log("filter : ", filter);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const {  data : transactionHistry, isLoading, error } = useGetEsewaPaymentsQuery(filter);
  transactionHistry && console.log("transactionHistry : ", transactionHistry);
  
  // Filter transactions based on search and status
  const filteredTransactions = transactionHistry?.transactions?.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.product_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount?.toString().includes(searchTerm) ||
      transaction.status?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'failed':
      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  const handlePrevPage = () => {
    if (filter.page > 1) {
      setFilter(prev => ({ ...prev, page: prev.page - 1 }));
    } else {
      toast.warn("Already at first page");
    }
  };

  const handleNextPage = () => {
    if (transactionHistry && filter.page < transactionHistry.totalPages) {
      setFilter(prev => ({ ...prev, page: prev.page + 1 }));
    } else {
      toast.warn("Already at last page");
    }
  };

  const clearDateFilter = () => {
    setFilter(prev => ({ ...prev, dateFrom: "", dateTo: "" }));
  };

  if (isLoading) {
    return (
      <div
        style={{ background: COLORS.black }}
        className="min-h-screen p-6 text-white font-sans flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading transactions...</p>
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
          <h3 className="mt-4 text-lg font-medium">Failed to load transactions</h3>
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
        .transaction-row:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 24px rgba(2,6,23,0.5); 
          border-color: rgba(255,255,255,0.08);
        }
      `}</style>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">eSewa Transaction History</h1>
          <p className="text-gray-400 mt-1">
            View and manage all eSewa payment transactions
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">
            {transactionHistry?.totalTransactions || 0}
          </div>
          <div className="text-sm text-gray-400">Total transactions</div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Search and Status Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Product ID, Amount, or Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Filter Toggle and Inputs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Date Filter</span>
            {/* {showDateFilter ? (
              <span className="text-emerald-400"></span>
            ) : (
              <span className="text-gray-400"></span>
            )} */}
          </button>
          
          {(filter.dateFrom || filter.dateTo) && (
            <button
              onClick={clearDateFilter}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
            >
              Clear Date Filter
            </button>
          )}
        </div>

        {/* Date Range Inputs */}
        {showDateFilter && (
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">From Date</label>
              <input
                type="date"
                value={filter.dateFrom}
                onChange={(e) => setFilter(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">To Date</label>
              <input
                type="date"
                value={filter.dateTo}
                onChange={(e) => setFilter(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="card rounded-xl overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-300">No transactions found</h3>
            <p className="mt-2 text-gray-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead style={{ background: COLORS.surface }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Product ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="transaction-row transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-emerald-400">
                          {transaction._id?.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm">
                          <Package className="w-4 h-4 mr-2 text-gray-400" />
                          {transaction.product_id?.substring(0, 12)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-white">
                          NPR {transaction.amount?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDateWithTime(transaction.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {(filter.page - 1) * filter.pageSize + 1} to {Math.min(filter.page * filter.pageSize, transactionHistry?.totalTransactions || 0)} of {transactionHistry?.totalTransactions || 0} transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={filter.page === 1}
                  className={`px-4 py-2 rounded-lg ${
                    filter.page === 1 
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>
                
                <div className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg">
                  Page {filter.page} of {transactionHistry?.totalPages || 1}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={transactionHistry && filter.page >= transactionHistry.totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    transactionHistry && filter.page >= transactionHistry.totalPages
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryAdmin;
