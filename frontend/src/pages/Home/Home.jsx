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
      {!userInfo &&
        (<>
        <HeroSection />
      <ShopByCategories/>
        </>)
      }
      
      <ProductGrid/>
      {/* Add more components or content here as needed */}
    </div>
  )
}

export default Home;

