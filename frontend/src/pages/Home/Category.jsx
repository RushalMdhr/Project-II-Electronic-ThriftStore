import { useListcategoryQuery } from '../../redux/api/categoryApiSlice';

const CategoryUsers = () => {
    const {data: categories=[], isLoading, isError} = useListcategoryQuery();
  return (
    <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories?.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                        {/* <p className="text-gray-600">ID: {category.id}</p> */}
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}

export default CategoryUsers
