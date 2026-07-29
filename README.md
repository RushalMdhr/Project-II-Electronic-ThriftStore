# ⚡ ReElectro

A multi-vendor marketplace for buying and selling second-hand electronic devices.

**ReElectro** is a MERN stack-based e-commerce platform designed to make it easier for users to buy and sell pre-owned electronic devices. Users can create accounts as buyers or sellers, list their used electronics with detailed information, browse available products, and purchase devices through the platform.

The project was developed as a college project to explore the development of a real-world, full-stack multi-vendor marketplace.

## ✨ Features

### 👤 User Accounts

* User registration and authentication
* Account management
* Buyer and seller functionality
* Users can browse products as buyers or list products as sellers

### 🛍️ Product Marketplace

* Browse second-hand electronic devices
* View detailed product information
* Product descriptions and specifications
* Seller-uploaded product listings
* Product ratings and reviews

### 🏪 Multi-Vendor Platform

Multiple users can participate in the marketplace as sellers and list their own second-hand electronic devices.

Sellers can:

* Create product listings
* Add product details and descriptions
* Upload product information
* Manage their listed products

Buyers can:

* Browse available products
* View product details
* Check seller and product information
* Purchase listed devices

### 💳 Payments & Checkout

The platform supports an e-commerce checkout flow with payment options such as:

* Cash on Delivery
* Online payment gateway integration

> Update this section with the exact payment gateway used in the project.

### 📦 Order Management

* Place orders for available products
* Track order information
* Manage order status

> Update this section based on the exact tracking functionality implemented in the project.

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Other Technologies

* REST APIs
* Authentication
* Payment Gateway
* Git & GitHub

> Add the exact libraries and services used in the project here.

## 🏗️ System Architecture

```text
                    ReElectro
                       │
             ┌─────────┴─────────┐
             │                   │
          Frontend             Backend
          React.js           Node.js + Express
             │                   │
             │              REST APIs
             │                   │
             └─────────┬─────────┘
                       │
                    MongoDB
                       │
             User & Product Data
                       │
              Orders & Transactions
```

## 🔄 How It Works

### For Buyers

```text
Create Account
      ↓
Browse Electronics
      ↓
View Product Details
      ↓
Select Product
      ↓
Checkout
      ↓
Choose Payment Method
      ↓
Place Order
      ↓
Track Order
```

### For Sellers

```text
Create Account
      ↓
Create Product Listing
      ↓
Add Product Details
      ↓
Publish Product
      ↓
Receive Orders
      ↓
Manage Order
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB

### Clone the Repository

```bash
git clone https://github.com/RushalMdhr/Project-II-Electronic-ThriftStore.git
```

Navigate to the project directory:

```bash
cd Project-II-Electronic-ThriftStoreo
```

### Install Dependencies

Install the dependencies for the frontend and backend according to the project structure.

```bash
npm install
```

> If the project has separate `client` and `server` directories, install dependencies in both directories.

### Environment Variables

Create a `.env` file and configure the required environment variables.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PAYMENT_GATEWAY_KEY=your_payment_gateway_key
```

> Never commit your `.env` file or expose API keys and secret credentials in a public repository.

### Run the Application

Start Both Concurrently
```
npm run dev
```

Start the backend server:

```bash
npm run server
```

Start the frontend:

```bash
npm run client
```

> Update these commands according to the actual scripts defined in your `package.json`.

## 📸 Screenshots

Add screenshots of the main application here.

### 🏠 Home Page

![Home Page](assets/home.png)

### 🛍️ Product Marketplace

![Marketplace](assets/marketplace.png)

### 📦 Product Details

![Product Details](assets/product-details.png)

### 💳 Checkout

![Checkout](assets/checkout.png)

## 🔮 Future Improvements

Potential improvements for the platform include:

* Advanced product search and filtering
* Product category management
* Seller verification
* User-to-user messaging
* Improved seller dashboards
* Real-time order tracking
* Product recommendation system
* Wishlist functionality
* Enhanced review and rating system
* AI-powered product recommendations
* Fraud and scam detection
* Improved payment security

## 🤝 Contributing

Contributions and suggestions are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Push your branch.
6. Open a Pull Request.

For major changes, please open an issue first to discuss the proposed changes.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 👨‍💻 Authors

Developed as a college project using the MERN stack.

Add your team members and GitHub profiles here.

---

⭐ If you found this project interesting, consider giving the repository a star!
