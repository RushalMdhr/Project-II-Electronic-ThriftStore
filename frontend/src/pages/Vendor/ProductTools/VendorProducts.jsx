import { useGetMyProductsQuery } from "../../../redux/api/productsApiSlice"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const VendorProducts = () => {
  const { data: myproducts, isLoading, isError, refetch } = useGetMyProductsQuery();
  console.log(myproducts)
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(()=>{
    refetch();
  },[location.key])
  const handleEdit = (product) => {
    console.log("Editing product:", product);
    
    navigate("/vendor/upload", { state: { product } });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching products.</div>;
  }

  return (
    <>
      <h1>hello vendor products</h1>
      <ul>
        {myproducts && myproducts.length > 0 ? (
          myproducts.map(x => (
            <li key={x._id} className="bg-gray-700 p-4 rounded-lg shadow mb-4">
              {x.name} : Rs.{x.price} - {x.category?.name || "Uncategorized"}
              <button onClick={() => handleEdit(x)} className="bg-red-400 border-2 border-red-600 rounded-2xl pl-4 pr-4 ml-3">Edit</button>
            </li>
          ))
        ) : (
          <li>No products found.</li>
        )}
      </ul>
    </>
  )
}

export default VendorProducts
