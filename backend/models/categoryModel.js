import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
    used: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=150&q=80",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
