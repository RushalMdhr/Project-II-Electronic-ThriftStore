import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const reviewsSchema = mongoose.Schema({
    name:{type : String, required: true},
    rating : {type : Number, required : true},
    comment:{type : String, required: true},
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User',
    },
},
{timestamps : true}
);

const ProductSchema = mongoose.Schema({
    name:{type : String, required: true},
    image : {type:String, required : true},
    brand : {type : String, required : true},
    quantity : {type : Number,required : true},
    category : {type : ObjectId, ref : "Category", required : true},
    description : {type:String, required : true},
    reviews : [reviewsSchema],
    rating : {type:Number,required : true, default: 0},
    numReviews : {type:Number, required : true, default : 0},
    price : {type:Number,required : true, default : 0},
    countInStock : {type:Number, required : true,default : 0}
},
{timestamps : true});

const Product = mongoose.model('Product',ProductSchema);
export default Product;


// ONE TO ONE
// profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }

// ONE TO MANY
// reviews: [reviewsSchema] // Embedded subdocuments (as in your model)
// // or
// reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] // References

// MANY TO ONE
// category: { type: ObjectId, ref: "Category", required: true }

// MANY TO MANY
// In Product
// categories: [{ type: ObjectId, ref: "Category" }]
// // In Category
// products: [{ type: ObjectId, ref: "Product" }]

