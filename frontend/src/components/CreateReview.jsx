import { useState } from "react";
import { useCreateReviewMutation } from "../redux/api/reviewApiSlice";
import { toast } from "react-toastify";

const CreateReview = ({ productId, orderId, sellerId }) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const [createReview, { isLoading }] = useCreateReviewMutation();
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("orderId", orderId);
    formData.append("sellerId", sellerId);
    formData.append("rating", rating);
    formData.append("description", description);

 if (images.length > 0) {
   images.forEach((img) => {
     formData.append("images", img);
   });
 }



    await createReview(formData).unwrap();



    toast.success("Review submitted!");
    setShowForm(false);
  } catch (err) {
    toast.error(err?.data?.message || "Error submitting review");
    console.log(err);
  }
};


  return (
    <div className="mt-4">
      {/* ---------- Toggle Button ---------- */}
      {!showForm && (
        <button
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          onClick={() => setShowForm(true)}
        >
          Write a Review
        </button>
      )}

      {/* ---------- Review Form ---------- */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md p-6 rounded-xl mt-4 space-y-4 border"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Write a Review
          </h2>

          {/* ⭐ Rating Stars */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  rating >= star ? "text-yellow-500" : "text-gray-400"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Description */}
          <textarea
            className="w-full border rounded-lg p-3 text-sm"
            placeholder="Share your experience..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full border rounded-lg p-2 text-sm"
            onChange={(e) => setImages([...e.target.files])}
          />

          <div className="flex gap-3">
            <button
              disabled={isLoading}
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700"
            >
              {isLoading ? "Submitting..." : "Submit Review"}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateReview;
