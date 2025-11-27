import { useSelector } from "react-redux";
import { Link } from "react-router";

const ProfileDropdown = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="fixed right-0 mt-1 w-70 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-50 overflow-hidden ">
      {/* User Info */}
      <div className="p-4 border-b border-slate-700 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-slate-700 flex items-center justify-center mb-2 shadow-lg">
          <span className="text-3xl text-white font-bold">
            {userInfo?.username?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <h2 className="text-white text-lg font-bold">
          {userInfo?.username || "User Name"}
        </h2>
        <p className="text-slate-400 text-sm">{userInfo?.email}</p>
        <span className="inline-block mt-2 bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">
          {userInfo?.isAdmin
            ? "Admin"
            : userInfo?.isVendor
            ? "Vendor"
            : "Customer"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col text-sm font-medium">
        <Link
          to={`/profile/${userInfo._id}`}
          className="px-4 py-2 text-gray-300 hover:bg-slate-800 transition"
        >
          Profile
        </Link>
        <Link
          to="/updateProfile"
          className="px-4 py-2 text-gray-300 hover:bg-slate-800 transition"
        >
          Edit Profile
        </Link>

        {/* Only show the rest if not admin */}
        {!userInfo?.isAdmin && (
          <>
            {userInfo?.isVendor ? (
              <Link
                to="/vendor/dashboard"
                className="px-4 py-2 text-gray-300 hover:bg-slate-800 transition"
              >
                Vendor Dashboard
              </Link>
            ) : (
              <Link
                to="/vendor/register"
                className="px-4 py-2 text-gray-300 hover:bg-slate-800 transition"
              >
                Become a Vendor
              </Link>
            )}

            <hr className="border-slate-700" />

            <Link
              to="/myorders"
              className="px-4 py-2 text-gray-300 hover:bg-slate-800 transition"
            >
              My Orders
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
