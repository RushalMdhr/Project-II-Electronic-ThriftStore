import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    isUser: {
      type: Boolean,
      required: true,
      default: true,
    },
    isVendor: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    shippingAddress: {
      name: String,
      street: String,
      city: {
        type: String,
        enum: [
          "Kathmandu",
          "Lalitpur",
          "Bhaktapur",
          "Kirtipur",
          "Madhyapur Thimi",
          "Tokha",
          "Budhanilkantha",
          "Gokarneshwar",
          "Sankharapur",
          "Chandragiri",
          "Godawari",
          "Suryabinayak",

          // Surrounding cities
          "Banepa",
          "Dhulikhel",
          "Panauti",
        ],
        default: "Bhaktapur",
        // required: true,
      },
      district: String,
      province: {
        type: String,
        enum: [
          "Koshi",
          "Madhesh",
          "Bagmati",
          "Gandaki",
          "Lumbini",
          "Karnali",
          "Sudurpashchim",
        ],
        default: "Bagmati",
        // required: true,
      },
      zipCode: String,
      // country: String,
      phone: {
        type: String,
        // required: true
      },
    },

    shopName: {
      type: String,
      default: null,
    },
    shopDescription: {
      type: String,
      default: null,
    },
    sales: {
      type: Number,
      default: 0,
    },
    income: {
      total: Number, // 120 + 200
      received: Number, // Already paid
      pending: Number, // To be paid
      // currency: {
      //   type: String,
      //   enum: ["USD", "EUR", "GBP", "NPR"],
      //   default: "NPR",
      // },
      // currency : {
      //   type : String,
      //   default : "Rs."
      // }
    },
    blackListStreak: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, //when we create or delete a user it will give the specific time
  }
);

const User = mongoose.model("User", userSchema);

export default User;
