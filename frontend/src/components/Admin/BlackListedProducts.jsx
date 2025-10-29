import { Link } from "react-router";
import {
  useAddToBlackListMutation,
  useGetBlackListedProductsQuery,
} from "../../redux/api/productsApiSlice";
import LoadingScreen from "../ui/Loading";

const BlackListedProducts = () => {
  const {
    data: blacklistedProducts,
    isLoading,
    isError,
  } = useGetBlackListedProductsQuery();
  const [addToBlackListSlice, {isLoading : isAdding}] = useAddToBlackListMutation();
  blacklistedProducts && console.log("black listed : ", blacklistedProducts);

//   const addToBlackList = (id) => {
//     try {
//       console.log("id : ", id);
//       const res = addToBlackListSlice({productId : })
//     } catch (error) {
//       console.error("error :", error);
//     }
//   };
  return (
    <>
      <h1>balck listed here ...</h1>
      {isLoading && <LoadingScreen />}
      {isError && <h2 className="text-red-500">Something went wrong...</h2>}
      {blacklistedProducts?.map((product) => (
        <div key={product._id}>
          <hr />
          <p>
            <Link to={`/overview/${product._id}`}>Name : {product.name}</Link>
          </p>
          <p>Price : {product.price}</p>
          <p>Report Percentage : {product.reportPercentage}</p>
          <p>Report Count : {product.reportsCount}</p>
          <p>Views Count :{product.viewsCount}</p>
          <button onClick={() => addToBlackListSlice({ productId: product._id })}>
            Add to blacklist ?
          </button>
        </div>
      ))}
    </>
  );
};

export default BlackListedProducts;
