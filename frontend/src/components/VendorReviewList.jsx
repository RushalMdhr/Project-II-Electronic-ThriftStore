import { useGetReviewsBySellerQuery } from "../redux/api/reviewApiSlice";

const VendorReviewList = ({ sellerId }) => {
  const {
    data: reviews,
    isLoading,
    error,
  } = useGetReviewsBySellerQuery(sellerId, {
    skip: !sellerId,
  });

  if (isLoading) return <p className="text-gray-600">Loading reviews...</p>;
  if (error) return <p className="text-red-600">Failed to load reviews.</p>;
  if (!reviews || reviews.length === 0)
    return <p className="text-gray-500">No reviews yet.</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-4">
      <h2 className="text-xl font-semibold text-emerald-700 mb-4">
        Customer Reviews
      </h2>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border rounded-lg p-4 bg-gray-50 hover:shadow transition"
          >
            {/* Reviewer Info */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={review.user?.avatar || "/default-avatar.png"}
                alt="reviewer"
                className="w-10 h-10 rounded-full border"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {review.user?.username || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xl ${
                    star <= review.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review Text */}
            {review.description && (
              <p className="text-gray-700 mb-3">{review.description}</p>
            )}

            {/* Review Images */}
            {review.images?.length > 0 && (
              <div className="flex gap-2 mt-2">
                {review.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="w-20 h-20 object-cover rounded border"
                    alt="review upload"
                  />
                ))}
              </div>
            )}

            {/* Product Info */}
            <div className="mt-3 bg-white p-3 rounded-lg border flex gap-3">
              <img
                src={review.productId?.images?.[0]}
                className="w-16 h-16 object-cover rounded"
                alt="product"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {review.productId?.name}
                </p>
                <p className="text-xs text-gray-500">
                  Product ID: {review.productId?._id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorReviewList;
