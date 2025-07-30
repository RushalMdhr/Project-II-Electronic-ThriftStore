import { useGetMyOrdersQuery } from "../../../redux/api/orderApiSlice"

const MyOrders = () => {
    const {data: myOrders=[],isLoading, isError} = useGetMyOrdersQuery();
    console.log(myOrders)
  return (
    <div>
      {myOrders?.map(order=>(
        <>
        <div>{order?.createdAt}</div>
        {order?.orderItems?.map(orderItem=>(
            <div key={orderItem._id}>
                <div>{orderItem.product.name}</div>
            </div>
        ))}

        <div className="text-red-400">{order?.total_price}</div>
        </>
      ))}
    </div>
  )
}

export default MyOrders
