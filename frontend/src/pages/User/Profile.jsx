import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Tabs from "../../components/Product/Tabs";
import {
  useGetCurrentUserQuery,
  useGetUserDetailsQuery,
} from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useEffect } from "react";
import ProductGrid from "../Home/ProductTools/ProductGrid";
import { useParams } from "react-router-dom";
import { useGetMyProductsQuery } from "../../redux/api/productsApiSlice";
import VendorReviewList from "../../components/VendorReviewList";
const Profile = () => {
  const { id: userId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  // No ID → don't show anything
  if (!userId) return <p>No user selected</p>;

  // Fetch user info
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useGetUserDetailsQuery(userId, {
    skip: !userId,
  });
  console.log("Profile", user);
  // Fetch user's products
  const {
    data: myProducts,
    isLoading: productLoading,
    isError: productError,
  } = useGetMyProductsQuery(userId, {
    skip: !userId,
  });

  // Handle loading
  if (userLoading) return <p>Loading...</p>;

  // Handle error (user not found)
  if (userError || !user) return <p>User not found</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------- COVER + AVATAR SECTION ---------- */}
      <section className="px-4 pt-4">
        {/* Cover Image */}
        <div className="relative rounded-3xl border-1 border-emerald-600 overflow-hidden shadow-md">
          {user?.isVendor ? (
            // ---- Vendor: Show actual cover image ----
            <img
              src={
                `http://localhost:5000/${user.coverPic}` ||
                "/uploads/cover/default.png"
              }
              alt="Cover"
              className="w-full h-56 md:h-72 object-cover"
            />
          ) : (
            // ---- Non-vendor: Show a pattern background ----
            <Link to="/vendor/register">
              <div
                className="relative w-full h-56 md:h-72 
    bg-gray-200 
    bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),
        linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]
    bg-[size:40px_40px]"
              >
                <button
                  className="absolute bottom-4 right-4 flex items-center gap-2 
             px-5 py-2.5 bg-emerald-600 text-white font-medium 
             rounded-xl shadow-md hover:bg-emerald-700 
             transition-all duration-200 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9l1-5h16l1 5M4 9h16v11H4V9z"
                    />
                  </svg>
                  Be a Seller
                </button>
              </div>
            </Link>
          )}
        </div>

        {/* Profile Area */}
        <div className="relative -mt-4">
          <div className="flex items-center gap-6 ml-[20%]">
            {/* Profile Image */}
            <img
              src={
                `http://localhost:5000/${user.profilePic}` ||
                "/uploads/profile/default.png"
              }
              alt={user.username}
              className="w-40 h-40 rounded-full ring-4 ring-emerald-600 shadow-2xl object-cover"
            />

            {/* LEFT COLUMN – Username / Email / Vendor Badge / Edit */}
            <div className="flex flex-col justify-center gap-2">
              {/* Username */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {user.username}
              </h1>

              {/* Email */}
              <p className="text-gray-600">{user.email}</p>

              {/* Vendor Badge */}
              <span
                className="inline-flex items-center bg-blue-100 border border-blue-300 text-blue-700 
               px-3 py-1 rounded-full text-xs font-medium w-fit"
              >
                {user?.isAdmin
                  ? "Admin"
                  : user?.isVendor
                  ? "Vendor"
                  : "Customer"}
              </span>
            </div>

            {/* RIGHT SIDE BADGES */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <div
                  key={user.sales} // re-triggers animation on change
                  className="
    absolute
    w-24 h-24
    grid place-content-center
    bg-gradient-to-br from-emerald-500 to-emerald-400
    rounded-full
    text-white
    font-bold
    text-xs
    shadow-xl
    border-4 border-emerald-200/80
    animate-bounce origin-bottom-left
  "
                  style={{
                    animationIterationCount: 1,
                    animationDuration: ".5s",
                  }}
                >
                  <div className="text-center leading-tight">
                    <div className="text-2xl">{user.sales}</div>
                    <div className="opacity-80">sales</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TABS SECTION ---------- */}
      <section className="pt-12 pb-12 px-4 max-w-5xl mx-auto">
        <Tabs labels={["About", "Products", "Reviews"]}>
          <div label="About">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-emerald-700 mb-4">
                  Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  {[
                    ["Street", user.shippingAddress?.street],
                    ["City", user.shippingAddress?.city],
                    ["District", user.shippingAddress?.district],
                    ["Province", user.shippingAddress?.province],
                    ["ZIP", user.shippingAddress?.zipCode],
                    ["Phone", user.shippingAddress?.phone],
                  ].map(([label, val]) => (
                    <p key={label}>
                      <span className="text-gray-400">{label}:</span>{" "}
                      <span className="font-medium">{val || "N/A"}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Member Since */}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-center">
                <p className="text-sm text-gray-400">Member since</p>
                <p className="text-xl font-semibold text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            {/* Vendor Information - full width */}
            {user.isVendor && (
              <div className="bg-emerald-100/70 rounded-2xl shadow-sm p-6 mt-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-emerald-700 mb-4">
                  Vendor Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  <p>
                    <span className="text-gray-400">Shop Name:</span>{" "}
                    <span className="font-medium">
                      {user.shopName || "N/A"}
                    </span>
                  </p>

                  <p>
                    <span className="text-gray-400">No. of Sales</span>{" "}
                    <span className="font-medium">{user.sales || "N/A"}</span>
                  </p>

                  <p>
                    <span className="text-gray-400">Shop Description:</span>{" "}
                    <span className="font-medium">
                      {user.shopDescription || "N/A"}
                    </span>
                  </p>

                  <p>
                    <span className="text-gray-400">Status:</span>{" "}
                    <span className="font-medium">
                      {user.vendor?.status || "Active"}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {userInfo?._id === userId && (
              <Link
                to={`/updateprofile`}
                className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-2.5
      bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
      text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl
      transition-all duration-200 active:scale-[0.98]"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
                Edit Profile
              </Link>
            )}
          </div>

          <div label="Products">
            {/* <p className="text-gray-600">
              Products listed by {user.username} appear here.
            </p> */}
            <div className="bg-gray-200">
              <ProductGrid products={myProducts} />
            </div>
          </div>

          <div label="Reviews">
            <VendorReviewList sellerId={userId} />
          </div>
        </Tabs>
      </section>
    </div>
  );
};

export default Profile;
