import { current } from "@reduxjs/toolkit";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";

const VendorPayments = () => {
  const statusFilter = "delivered";
  const paymentStatusFilter = "all"; //paid pending
  const currentPage = 1;

  const { data: allOrders } = useGetOrdersQuery({
    status: statusFilter,
    paymentStatus: paymentStatusFilter,
    // dateFrom,
    // dateTo,
    page: currentPage,
    pageSize: 10,
  });

  allOrders && console.log("allorders : ", allOrders);
  return <>hello</>;
};

export default VendorPayments;
