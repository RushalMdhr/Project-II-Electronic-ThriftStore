import { useState } from "react";
import LoadingScreen from "../components/ui/Loading";
import { useUpdateOrderToPaidMutation } from "../redux/api/orderApiSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useCreateProductMutation } from "../redux/api/productsApiSlice";

const ProductCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateOrderToPaid] = useUpdateOrderToPaidMutation();
  const [uploadProduct] = useCreateProductMutation();
  const [specifications, setSpecification] = useState({});
  const [dict, setDict] = useState({
    head: "",
    description: "",
  });

  const handleTesting = async () => {
    console.log("okay...");
    toast.loading("paying ...");
    const update = await updateOrderToPaid({
      data: { method: "esewa" },
      orderId: "68ff7001481a5249ad66b4d9",
    }).unwrap();
    toast.dismiss();
    // 68ff7001481a5249ad66b4d9
    toast.success("Order Paid Successfully");
    console.log("res", update);
  };

  const uploadDummyProduct = async () => {
    toast.loading("creating dummy product..");
    const formData = new FormData();
    console.log("i m here");

    formData.append("name", "Dummy");
    formData.append("brand", "Dummy Brand");
    formData.append("price", 100);
    formData.append(
      "description",
      "This just a dummy product to show case the site Dummy - description"
    );
    formData.append("category", "6901dc594471da93aa7af305");
    formData.append("countInStock", 1);
    formData.append("condition", "Excellent condition");
    formData.append(
      "specifications",
      JSON.stringify({
        storage: "200GB",
        camera: "48 mega pixel",
      })
    );
    console.log(formData);
    try {
      const res = uploadProduct(formData).unwrap();
      console.log("res : ", res);
      toast.dismiss();
      toast.success("dummy product created...");
    } catch (error) {
      console.error(error);
    }
  };

  const displayData = () => {
    console.log("specifications : ", specifications);
    console.log("dict : ", dict);
  };

  const setData = () => {
    // setDict({
    //   head : "",
    //   description : ""
    // })
    setSpecification({ ...specifications, ...dict });
    console.log("specifications : ", specifications);
    console.log("dict : ", { ...dict });
  };
  return (
    <>
      <button
        onClick={() => setIsLoading(!isLoading)}
        className="p-2 bg-red-200 text-red-700 border-2 rounded-2xl m-4"
      >
        Load
      </button>
      <h1>
        {isLoading ? (
          <LoadingScreen setIsLoading={setIsLoading} />
        ) : (
          <>not loading</>
        )}
      </h1>

      <h1>TEST HERE APIS</h1>
      <button
        className="p-2 bg-red-200 text-red-700 border-2 rounded-2xl m-4"
        onClick={handleTesting}
        // disabled={true}
      >
        To Paid
        {/* /disabled/ */}
      </button>

      <button className="p-2 bg-red-200 text-red-700 border-2 rounded-2xl m-4">
        <Link to="/testcomponent">Test Component</Link>
      </button>
      <button
        className="p-2 bg-red-200 text-red-700 border-2 rounded-2xl m-4"
        onClick={uploadDummyProduct}
      >
        Upload Dummy Product
      </button>
      <hr />

      <div>creating the data type</div>
      <input
        type="text"
        className="border-1 m-2"
        value={dict.head}
        onChange={(e) => {
          setDict({ ...dict, head: e.target.value });
        }}
        placeholder="title"
      />
      <input
        type="text"
        className="border-1 m-2"
        value={dict.description}
        onChange={(e) => {
          setDict({ ...dict, description: e.target.value });
        }}
        placeholder="description"
      />
      <br />
      <button className="mx-5 px-40 border-1 bg-green-300" onClick={setData}>
        +
      </button>
      <div>display : </div>
    </>
  );
};

export default ProductCard;
