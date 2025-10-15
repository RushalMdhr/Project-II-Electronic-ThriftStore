import { useState } from "react";
import LoadingScreen from "../components/ui/Loading";

const ProductCard = () => {
  const [isLoading,setIsLoading] = useState(false);

  return <>
  <button 
  onClick={()=>setIsLoading(!isLoading)}
  className="p-2 bg-red-200 text-red-700 border-2 rounded-2xl m-4"
  >
    Load
  </button>
  <h1>{isLoading ? (<LoadingScreen setIsLoading={setIsLoading} />): (<>not loading</>)}</h1>
  </>;
};

export default ProductCard;
