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
      default: "https://via.placeholder.com/150",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
