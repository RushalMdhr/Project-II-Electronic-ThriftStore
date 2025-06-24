import { useSelector } from "react-redux";
import { Link } from "react-router";
const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className="flex flex-col gap-4 items-start p-6">
      <Link
        to="/updateProfile"
        className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
      >
        Update Profile
      </Link>
      {userInfo.isVendor ? (
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition"
        >
          My Dashboard
        </Link>
      ) : (
        <h1 className="text-red-600 font-semibold">BE A Vendor ?</h1>
      )}
      <Link
        to="/orderHistory"
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-2xl hover:bg-gray-300 transition"
      >
        Order History
      </Link>
      <Link
        to="/wishlist"
        className="px-4 py-2 bg-pink-500 text-white rounded-2xl hover:bg-pink-600 transition"
      >
        Wishlist
      </Link>
      <Link
        to="/portfolio"
        className="px-4 py-2 bg-yellow-400 text-black rounded-2xl hover:bg-yellow-500 transition"
      >
        Reviews & Ratings
      </Link>
    </div>
  );
};

export default Profile;
