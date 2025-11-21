import { Search, ArrowDownUp, X } from "lucide-react";

const OrderFilterBar = ({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  sort,
  setSort,
  sortOptions = [
    { key: "createdAt", label: "Newest first" },
    { key: "total", label: "Highest total" },
    { key: "status", label: "Status" },
  ],
}) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-3">
      {/* search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order-ID or item name…"
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
        />
      </div>

      {/* calendar */}
      <div className="relative">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
        />
        {dateFilter && (
          <button
            type="button"
            onClick={() => setDateFilter("")}
            className="absolute -right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear date"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* sort */}
      <div className="relative">
        <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none bg-white"
        >
          {sortOptions.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderFilterBar;
