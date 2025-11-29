import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const adminPaymentSchema = mongoose.Schema(
  {
    customerId: { type: ObjectId, ref: "User", required: true },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        payment : { type: Number, required: true},
      },
    ],
    charges : { type: Number, default: 0 },
    earned : { type: Number, default: 0 },
    Address : {
      street: String,
      city: String,
      district: String,
      province: String,
      phone : String,
    },
     payment: {
      method: String,
      transactionId: String,
    },
    OrderDeliveredDate: Date,
  },
);

export default mongoose.model("Payments", adminPaymentSchema);
