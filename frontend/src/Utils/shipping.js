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

  // Calculate shipping per vendor (single city per vendor)
  Object.values(vendorGroups).forEach((group) => {
    const vendorCity = group.vendorInfo.shippingAddress?.city;
    group.shipping = vendorCity === customerCity ? 50 : 150;
  });

  return vendorGroups;
};
