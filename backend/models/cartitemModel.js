// create a cartitem model
import mongoose from 'mongoose';

const cartItemSchema =  mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price:{
    type: Number,
    required: true,
  }
},
{timestamps:true}
);

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;
