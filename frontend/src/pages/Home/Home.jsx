import HeroSection from './HeroSection.jsx';
import ShopByCategories from '../User/ShopByCategories.jsx';
import { useSelector } from 'react-redux';
import ProductGrid from './ProductTools/ProductGrid.jsx';

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  return (
    <div>
      {/* {userInfo.isVendor? (<h1 className='px-100 py-10'>Vendor</h1>) : (<h1 className='px-100 py-10'>Not A Vendor</h1>)} */}
      {/* {!userInfo &&
        (<>
        
        </>)
      } */}
      <HeroSection />
      <ShopByCategories />
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Trending Thrift Finds
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the most popular pre-loved items from our community of
          sellers
        </p>
      </div>
      <ProductGrid />
      {/* Add more components or content here as needed */}
    </div>
  )
}

export default Home;

