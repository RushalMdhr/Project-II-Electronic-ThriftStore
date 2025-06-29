import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "remixicon/fonts/remixicon.css";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async (e) => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.info("You have been logged out");
    } catch (error) {
      toast.error("Logout failed");
      toast.error(error?.data?.message || error.message || "Logout failed");
    }
  };

  return (
    <div>
      <nav className="bg-[#0a1120] pl-2 pr-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a href="/">
            <span className="text-3xl font-bold text-[#1de9b6]">Thrift</span>
            <span className="text-3xl font-bold text-white">Tech</span>
          </a>
        </div>
        {/* Nav Links */}
        <div className="flex items-center space-x-8">
          <a
            href="/"
            className="flex items-center text-white text-lg font-semibold hover:text-[#1de9b6] transition"
          >
            <i className="ri-home-4-line mr-1"></i> Home
          </a>
          <a
            href="/admin/productcard"
            className="flex items-center text-white text-lg font-semibold hover:text-[#1de9b6] transition"
          >
            <i className="ri-box-3-line mr-1"></i> Products
          </a>
          <a
            href="#"
            className="flex items-center text-white text-lg font-semibold hover:text-[#1de9b6] transition"
          >
            <i className="ri-apps-2-line mr-1"></i> Categories
          </a>
          {userInfo && userInfo.isVendor ? (
            <>
              <a
                href="/vendor/dashboard"
                className="flex items-center text-white text-lg font-semibold hover:text-[#1de9b6] transition"
              >
                <i className="ri-dashboard-line mr-1"></i> Dashboard
              </a>
              <a
                href="/vendor/upload"
                className="flex items-center text-white text-lg font-semibold hover:text-[#1de9b6] transition"
              >
                <i className="ri-dashboard-line mr-1"></i> Upload
              </a>
            </>
          ) : (
            <a
              href="/vendor/register"
              className="flex items-center text-white text-lg font-semibold hover:text-[#1de9b6] transition"
            >
              <i className="ri-store-2-line mr-1"></i> Vendors
            </a>
          )}
          <a
            href="#"
            className="flex items-center text-white text-lg font-semibold hover:text-[#1de9b6] transition"
          >
            <i className="ri-article-line mr-1"></i> Blog
          </a>
        </div>
        {/* Search and Icons */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="flex items-center bg-[#131a2b] px-3 py-1 rounded-lg">
            <span className="text-[#1de9b6] text-xl mr-2">
              <i className="ri-search-line"></i>
            </span>
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-white placeholder:text-gray-400 w-24"
            />
          </div>
          {/* Icons */}
          <span
            title="Toggle Theme"
            className="text-white text-2xl hover:text-[#1de9b6] cursor-pointer transition-colors duration-200"
          >
            <i className="ri-sun-line"></i>
          </span>

          {userInfo ? (
            <>
              <span
                title="Wishlist"
                className="text-white text-2xl hover:text-[#1de9b6] cursor-pointer transition-colors duration-200"
              >
                <i className="ri-heart-line"></i>
              </span>
              <span
                title="Notifications"
                className="text-white text-2xl hover:text-[#1de9b6] cursor-pointer transition-colors duration-200 relative"
              >
                <i className="ri-notification-3-line"></i>
                <span className="absolute -top-2 -right-2 bg-[#1de9b6] text-xs text-[#0a1120] rounded-full px-1.5 font-bold">
                  3
                </span>
              </span>
              <a href="/cart">
                <span
                    
                    title="Cart"
                    className="text-white text-2xl hover:text-[#1de9b6] cursor-pointer transition-colors duration-200 relative"
                    >
                    <i className="ri-shopping-cart-line"></i>
                    <span className="absolute -top-2 -right-2 bg-[#1de9b6] text-xs text-[#0a1120] rounded-full px-1.5 font-bold">
                      2
                    </span>
                </span>
              </a>
              <a href="/profile">
                <span
                  title="Profile"
                  className="text-white text-2xl hover:text-[#1de9b6] cursor-pointer transition-colors duration-200"
                >
                  <i className="ri-user-line">{userInfo.username}</i>
                </span>
              </a>
              <button onClick={logoutHandler}>
                <span
                  title="Login"
                  className="text-white text-2xl hover:text-[#1de9b6] cursor-pointer transition-colors duration-200"
                >
                  <i className="ri-login-box-line"></i>
                </span>
              </button>
            </>
          ) : (
            <a
              href="login"
              className="text-white text-lg font-bold ml-2 hover:text-[#1de9b6] transition flex items-center"
            >
              <i className="ri-login-circle-line mr-1"></i> Login
            </a>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
