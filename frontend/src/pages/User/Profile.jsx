import { useSelector } from "react-redux";
import { Link } from "react-router";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-900 rounded-2xl shadow-lg flex flex-col gap-4 items-center">
      {/* User Info */}
      <h2 className="text-white text-xl font-semibold">{userInfo?.username || "User Name"}</h2>
      <p className="text-slate-300 text-sm">{userInfo?.email}</p>

      {/* Action Buttons */}
      <Link
        to="/updateProfile"
        className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full transition"
      >
        Update Profile
      </Link>

      {userInfo?.isVendor ? (
        <>
          <Link
            to="/dashboard"
            className="w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full transition"
          >
            My Dashboard
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
  );
};

export default Profile;
