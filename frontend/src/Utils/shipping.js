// utils/shipping.js
export const groupProductsByVendor = (products, customerCity) => {
  const vendorGroups = {};

  products.forEach((item) => {
    const vendor = item.product.uploadedBy;
    if (!vendor?._id) return;

    if (!vendorGroups[vendor._id]) {
      vendorGroups[vendor._id] = {
        vendorInfo: vendor,
        items: [],
        shipping: 0,
      };
    }

    vendorGroups[vendor._id].items.push(item);
  });

  // Calculate shipping for each vendor based on vendor city vs customer city
  Object.values(vendorGroups).forEach((group) => {
    const vendorCities = group.items.map(
      (i) => i.product.uploadedBy?.shippingAddress?.city
    );
    const uniqueVendorCities = [...new Set(vendorCities)];
    const vendorCity = uniqueVendorCities[0]; // assuming single vendor city

    group.shipping = vendorCity === customerCity ? 50 : 150;
  });

  return vendorGroups;
};
