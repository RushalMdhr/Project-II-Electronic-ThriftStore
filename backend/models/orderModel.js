import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  subtotal: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  payment: {
    method: { type: String, enum: ['cod', 'esewa'], required: true , default:'cod'},
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    paidAt: Date
  },
  deliveredAt: Date
}, { timestamps: true });

// Auto-calc subtotal, tax, total
OrderSchema.pre('save', function (next) {
  this.subtotal = this.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  if (!this.shipping) this.shipping = 100; // default shipping
  if (!this.tax) this.tax = this.subtotal * 0.13; // 13% VAT
  this.total = this.subtotal + this.shipping + this.tax;
  next();
});

OrderSchema.index({ "items.vendorId": 1 });

const Order = mongoose.model("Order", OrderSchema);
export default Order;