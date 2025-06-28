import { useSelector } from "react-redux";
import ProductGrid from "./ProductTools/ProductGrid";
import HeroSection from './HeroSection.jsx';
import ShopByCategories from '../User/ShopByCategories.jsx';

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;

  console.log("🟢 Home userInfo:", userInfo);
  console.log("🟢 Home userId:", userId);

  return (
    <div>
      {!userInfo && (
        <>
          <HeroSection />
          <ShopByCategories />
        </>
      )}

      <ProductGrid userId={userId} />
    </div>
  );
};

export default Home;
