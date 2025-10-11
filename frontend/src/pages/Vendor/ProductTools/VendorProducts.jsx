import { useGetMyProductsQuery } from "../../../redux/api/productsApiSlice"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const VendorProducts = () => {
  const {userInfo} = useSelector(state=>state.auth)
  console.log("userInfo :",userInfo)
  const { data: myproducts, isLoading, isError, refetch } = useGetMyProductsQuery(userInfo._id);
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-emerald-400 mb-8 text-left">
        My Products (Vendor)
      </h1>

      {myproducts && myproducts.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {myproducts.map((x) => (
            <li
              key={x._id}
              className="bg-gray-800/80 border border-gray-700 hover:border-emerald-400 
  rounded-xl shadow-md hover:shadow-emerald-400/20 
  p-4 flex flex-col gap-2 transition-all duration-300 min-h-[110px]"
            >
              <h2 className="text-lg font-semibold text-emerald-300 truncate mb-1">
                {x.name}
              </h2>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium">Price:</span> Rs.{x.price}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {x.category?.name || "Uncategorized"}
                  </p>
                </div>

                <button
                  onClick={() => handleEdit(x)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 
      text-white font-medium rounded-lg px-4 py-1 border border-emerald-600 
      hover:from-emerald-600 hover:to-teal-600 hover:shadow-md hover:shadow-emerald-500/20 
      transition-all duration-200 text-sm ml-3"
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16 text-gray-400">
          <i className="ri-inbox-2-line text-5xl mb-3 text-gray-500"></i>
          <p className="text-lg">No products found.</p>
        </div>
      )}
    </div>
  );
}

export default VendorProducts
