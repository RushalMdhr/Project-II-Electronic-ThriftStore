import { useState } from "react";
import { useGetAllReviewsQuery } from "../../redux/api/reviewApiSlice";

const ReviewList = () => {
  const { data, isLoading, error } = useGetAllReviewsQuery();
  const [sortBy, setSortBy] = useState("newest");

  if (isLoading) return <p className="text-gray-300">Loading reviews...</p>;
  if (error) return <p className="text-red-400">Error loading reviews</p>;

  const reviews = data?.reviews || [];

  // SORTING
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "rating-high") return b.rating - a.rating;
    if (sortBy === "rating-low") return a.rating - b.rating;
    if (sortBy === "seller")
      return (a.sellerId?.username || "").localeCompare(
        b.sellerId?.username || ""
      );
    if (sortBy === "product")
      return (a.productId?.name || "").localeCompare(b.productId?.name || "");
    return 0;
  });

  // GROUPING
  const groupBy = (key) =>
    sortedReviews.reduce((acc, review) => {
      let label;

      if (key === "productId") {
        label = review.productId?.name || "Unknown Product";
      } else if (key === "sellerId") {
        label = review.sellerId?.username || "Unknown Seller";
      } else if (key === "user") {
        label = review.user?.username || "Unknown User";
      } else {
        label = "Unknown";
      }

      acc[label] = acc[label] || [];
      acc[label].push(review);
      return acc;
    }, {});

  const reviewsBySeller = groupBy("sellerId");
  const reviewsByProduct = groupBy("productId");

  // RENDER GROUPED
  const renderGrouped = (group) =>
    Object.entries(group).map(([groupName, list]) => (
      <div
        key={groupName}
        className="mb-6 p-4 rounded-xl bg-gray-800 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-emerald-400 mb-3">
          {groupName} ({list.length})
        </h3>

        {list.map((review) => (
          <div
            key={review._id}
            className="border border-gray-700 p-4 rounded-lg bg-gray-900 mb-2"
          >
            {/* USER + DATE */}
            <div className="flex justify-between">
              <p className="font-semibold text-gray-100">
                {review.user?.username}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* PRODUCT INFO */}
            <div className="flex items-center gap-3 mt-3">
              {review.productId?.images?.length > 0 && (
                <img
                  src={review.productId.images[0]}
                  className="w-14 h-14 rounded-md object-cover border border-gray-700"
                  alt="product"
                />
              )}
              <div>
                <p className="text-gray-300">
                  <span className="font-medium text-gray-200">Product:</span>{" "}
                  {review.productId?.name || "Unknown Product"}
                </p>

                <p className="text-gray-300">
                  <span className="font-medium text-gray-200">Seller:</span>{" "}
                  {review.sellerId?.username || "Unknown Seller"}
                </p>
              </div>
            </div>

            {/* STARS */}
            <div className="text-yellow-400 mt-2">
              {"★".repeat(review.rating)} {"☆".repeat(5 - review.rating)}
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-300 mt-2">{review.description}</p>

            {/* REVIEW IMAGES */}
            {review.images?.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    className="w-16 h-16 object-cover rounded-md border border-gray-700"
                    alt="review-img"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    ));

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">All Reviews</h2>

        {/* SORT SELECT */}
        <select
          className="border border-gray-700 bg-gray-800 text-gray-200 px-3 py-2 rounded-lg"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="rating-high">Rating High → Low</option>
          <option value="rating-low">Rating Low → High</option>
          <option value="seller">Sort by Seller</option>
          <option value="product">Sort by Product</option>
        </select>
      </div>

      {/* GROUPED VIEW */}
      {sortBy === "seller" && renderGrouped(reviewsBySeller)}
      {sortBy === "product" && renderGrouped(reviewsByProduct)}

      {/* STRAIGHT LIST */}
      {sortBy !== "seller" && sortBy !== "product" && (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-500 p-4 rounded-lg bg-gray-900 mb-2 shadow-md shadow-black/30"
            >
              {/* USER + DATE */}
              <div className="flex justify-between mb-2">
                <p className="font-semibold text-gray-200">
                  {review.user?.username}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* PRODUCT + SELLER */}
              <div className="flex items-center gap-3 mt-2">
                {review.productId?.images?.length > 0 && (
                  <img
                    src={review.productId.images[0]}
                    className="w-14 h-14 rounded-md object-cover border border-gray-700"
                    alt="product"
                  />
                )}

                <div>
                  <p className="text-gray-300">
                    <span className="font-medium text-gray-200">Product:</span>{" "}
                    {review.productId?.name}
                  </p>

                  <p className="text-gray-300">
                    <span className="font-medium text-gray-200">Seller:</span>{" "}
                    {review.sellerId?.username}
                  </p>
                </div>
              </div>

              {/* STARS */}
              <p className="text-yellow-400 mt-2">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </p>

              {/* DESCRIPTION */}
              <p className="mt-2 text-gray-300">{review.description}</p>

              {/* REVIEW IMAGES */}
              {review.images?.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      className="w-16 h-16 object-cover rounded-md border border-gray-700"
                      alt="review-img"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
