import HeroSection from './HeroSection.jsx';
import ShopByCategories from './ShopByCategories.jsx';

const Home = () => {
  // cont [data : products ] = 
  return (
    <div>
      <h1 className='px-100 py-10'>HOME</h1>
      <HeroSection />
      <ShopByCategories/>
      {/* Add more components or content here as needed */}
    </div>
  )
}

export default Home;
