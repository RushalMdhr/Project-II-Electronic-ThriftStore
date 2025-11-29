import { useState } from "react";
import { useGetReviewsByProductQuery } from "../redux/api/reviewApiSlice";

const ReviewByProduct = ({ productId }) => {
  const {
    data,
    isLoading,
    error,
  } = useGetReviewsByProductQuery(productId, {
    skip: !productId,
  });

  const [previewImage, setPreviewImage] = useState(null);

  if (isLoading) return <p className="text-gray-600">Loading reviews...</p>;
  if (error) return <p className="text-red-600">Failed to load reviews.</p>;


if (!data || !data.reviews || data.reviews.length === 0) {
  return <p className="text-gray-500">No reviews yet.</p>;
}

  const { reviews, averageRating, totalReviews } = data;

  return (
    <>
      {/* FULLSCREEN IMAGE VIEWER */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
          />
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md mt-4">
        <h2 className="text-xl font-semibold text-emerald-700 mb-4">
          Product Reviews
        </h2>

        {/* Rating Header */}
        <div className="flex items-center gap-3 mb-4">
          <div>
            {[1, 2, 3, 4, 5].map((star) => {
              const isFull = star <= Math.floor(averageRating);
              const isHalf =
                star === Math.ceil(averageRating) && averageRating % 1 !== 0;

              return (
                <span key={star} className="relative text-2xl">
                  {/* Gray background star */}
                  <span className="text-gray-300">★</span>

                  {/* Full star overlay */}
                  {isFull && (
                    <span className="absolute left-0 top-0 text-yellow-500">
                      ★
                    </span>
                  )}

                  {/* Half star overlay */}
                  {isHalf && (
                    <span
                      className="absolute left-0 top-0 text-yellow-500 overflow-hidden"
                      style={{ width: "50%" }}
                    >
                      ★
                    </span>
                  )}
                </span>
              );
            })}
          </div>
          {/* Rating text */}
          <p className="text-gray-800 font-medium">
            {averageRating.toFixed(1)} / 5 ({totalReviews} reviews)
          </p>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border rounded-lg p-4 bg-gray-50 hover:shadow transition"
            >
              {/* User Info */}
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
                      star <= review.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
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
                      onClick={() => setPreviewImage(img)}
                      className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                      alt="review upload"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewByProduct;
