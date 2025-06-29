import React from "react";
import { useParams } from "react-router";

const BuyProduct = ({ products }) => {
  if (!Array.isArray(products)) {
    // If products is a single product object, convert it to an array
    if (products && typeof products === "object" && !Array.isArray(products)) {
      products = [products];
    } else {
      return null;
    }
  }

  console.log("buyingproducts",products)
  return (
    <div>
      {products.map((product, idx) => (
        <React.Fragment key={idx}>
          <div>{product.name}</div>
          <div>{product.price}</div>
          <div>{product.countInStock}</div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BuyProduct;
