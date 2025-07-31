import { useSelector } from "react-redux";
import { Link } from "react-router";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-slate-900 rounded-3xl shadow-2xl flex flex-col gap-6 items-center">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mb-2 shadow-lg">
        <span className="text-4xl text-white font-bold">
          {userInfo?.username?.charAt(0).toUpperCase() || "U"}
        </span>
      </div>
      {/* User Info */}
      <h2 className="text-white text-2xl font-bold">{userInfo?.username || "User Name"}</h2>
      <p className="text-slate-300 text-base">{userInfo?.email}</p>
      <div className="flex gap-4 mt-2">
        <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">
          {userInfo?.isVendor ? "Vendor" : "Customer"}
        </span>
        {/* Add more tags if needed */}
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3 mt-6">
        <Link
          to="/updateProfile"
          className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full transition"
        >
          Edit Profile
        </Link>

        {userInfo?.isVendor ? (
          <>
            <Link
              to="/vendor/dashboard"
              className="w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full transition"
            >
              Vendor Dashboard
            </Link>
            <Link
              to="/portfolio"
              className="w-full text-center bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-full transition"
            >
              Reviews & Ratings
            </Link>
          </>
        ) : (
          <Link
            to="/vendor/register"
            className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-full transition"
          >
            Become a Vendor
          </Link>
        )}

        <Link
          to="/myorders"
          className="w-full text-center bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 rounded-full transition"
        >
          My Orders
        </Link>
        <Link
          to="/orderHistory"
          className="w-full text-center bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 rounded-full transition"
        >
          Order History
        </Link>
        <Link
          to="/wishlist"
          className="w-full text-center bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-full transition"
        >
          Wishlist
        </Link>
      </div>
    </div>
  );
};

export default Profile;
