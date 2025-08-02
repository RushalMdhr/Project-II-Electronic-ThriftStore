import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

// const reviewsSchema = mongoose.Schema({
//     name:{type : String, required: true},
//     rating : {type : Number, required : true},
//     comment:{type : String, required: true},
//     user : {
//         type : mongoose.Schema.Types.ObjectId,
//         required : true,
//         ref : 'User',
//     },
// },
// {timestamps : true}
// );

// const ratingsSchema = mongoose.Schema({
//     rating: { type: Number, min: 1, max: 5, default: 0 },
//     user: {
//         type : ObjectId, ref : "User", required : true
//     },
// })

const ProductSchema = mongoose.Schema({
    name: { type: String, required: true },
    images: [{ type: String, required: true }], //{type:String, required : true},
    brand: { type: String, required: true },
    // quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    // reviews : [reviewsSchema],
    condition: {
        type: String,
        required: true,
        enum: ["Brand New", "Like New", "Refurbished", "Good", "Fair"],
        default: "Brand New",
    },
    // numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    discountedPrice: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 1 },
    uploadedBy: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    views: [{ type: String }],
    reported: [{
        user: {
            type: ObjectId,
            ref: "User"
        },
        reason: { type: String }
    }]
},
    { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
//today i want something different in product so that many people can see the best item in the shop
//it may not be like but can be view


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

