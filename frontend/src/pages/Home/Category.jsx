import { useListcategoryQuery } from "../../redux/api/categoryApiSlice";
import CategoryCard from "../User/CategoryCard";
import { useNavigate } from "react-router";

const Category = () => {
  const navigate = useNavigate();
  const handleCategoryClick = (id) => {
    navigate(`/products?category=${id}`);
  };
  const { data: categories = [], isLoading, isError } = useListcategoryQuery();
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <div key={category.id}>
              <CategoryCard category={category} onClick={handleCategoryClick} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Category;
