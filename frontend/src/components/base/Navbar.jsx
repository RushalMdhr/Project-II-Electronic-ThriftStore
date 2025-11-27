import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import "remixicon/fonts/remixicon.css";
import { setRole } from "../../redux/features/auth/authSlice";
import ProfileDropdown from "../ProfileDropdown";

const Navbar = () => {
  const { userInfo, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // useEffect(() => {
  //   // Redirect to home page on reload/app start
  //   navigate("/");
  // }, [navigate]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = async () => {
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const Search = encodeURIComponent(search.trim());
      navigate(`/products?keyword=${Search}`, { state: { Search } });
    } else {
      navigate("/products");
    }
  };

  // Handler to navigate to vendor register page and close dropdown
  const handleBeSellerClick = () => {
    setDropdownOpen(false);
    navigate("/vendor/register");
  };

  return (
    <>
      <div className="h-16 w-full" />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b ${
          userInfo?.isAdmin ? "bg-gray-900/80" : "bg-teal-900/90"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center mr-8">
              <Link
                to="/"
                className="flex items-center space-x-2"
                onClick={() => dispatch(setRole("buyer"))}
              >
                <div className="text-2xl font-bold text-emerald-400">
                  Thrift
                </div>
                <div className="text-2xl font-bold text-white">Tech</div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-300 hover:text-white"
                onClick={() => dispatch(setRole("buyer"))}
              >
                Home
              </Link>
              <Link
                // to={
                //   userInfo?.isVendor ? `/vendor/order-management` : userInfo?.isAdmin ? `/admin/orders`: `/myorders`
                // }
                // to={`/profile/${userInfo.username}`}
                // to="/tester"
                // to="/testcomponent"
                // to="/delivery-orders-checkup"
                // to="/admin/vendor-payments"
                // to={`/profile/${userInfo._id}`}
                className="text-gray-300 hover:text-white"
                onClick={() => dispatch(setRole("buyer"))}
              >
                PM
              </Link>

              {(role === "buyer" || !userInfo?.isVendor) &&
                !userInfo?.isAdmin && (
                  <>
                    <Link
                      to="/products"
                      className="text-gray-300 hover:text-white"
                    >
                      Shop
                    </Link>
                    <Link
                      to="/categories"
                      className="text-gray-300 hover:text-white"
                    >
                      Categories
                    </Link>
                  </>
                )}

              {userInfo?.isAdmin && (
                <>
                  <Link
                    to="/products"
                    className="text-gray-300 hover:text-white"
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/categories"
                    className="text-gray-300 hover:text-white"
                  >
                    Categories
                  </Link>
                  <Link to="/admin" className="text-gray-300 hover:text-white">
                    Admin Panel
                  </Link>
                </>
              )}

              {/* Seller links */}
              {role === "seller" &&
                userInfo?.isVendor &&
                !userInfo?.isAdmin && (
                  <>
                    {/* <Link
                      to="/vendor/dashboard"
                      className="text-gray-300 hover:text-white"
                    >
                      Dashboard
                    </Link> */}
                    <Link
                      to="/vendor/products"
                      className="text-gray-300 hover:text-white"
                      // onClick={() => dispatch(setRole("buyer"))}
                    >
                      My Products
                    </Link>
                    {/* <Link
                      to="/vendor/upload"
                      className="text-gray-300 hover:text-white"
                    >
                      Upload
                    </Link> */}
                  </>
                )}
            </div>

            {/* Search Bar */}
            <form
              className="flex items-center flex-1 max-w-md mx-8"
              onSubmit={handleSearch}
            >
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <button type="submit" aria-label="Search">
                    <i className="ri-search-line" />
                  </button>
                </span>
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for products..."
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-400"
                />
              </div>
            </form>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {!userInfo?.isAdmin && (
                <Link to="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-white"
                    aria-label="Cart"
                  >
                    <i className="ri-shopping-cart-line text-xl" />
                  </Button>
                </Link>
              )}

              {/* Vendor user: Buyer/Seller toggle */}
              {userInfo && userInfo.isVendor && !userInfo.isAdmin && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="text-gray-300 hover:text-white flex items-center gap-1"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    type="button"
                  >
                    {role === "seller" ? "Seller" : "Buyer"} <span>▾</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute mt-2 w-32 bg-white text-black rounded shadow-md z-50">
                      <button
                        onClick={() => {
                          dispatch(setRole("buyer"));
                          setDropdownOpen(false);
                          navigate("/");
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        type="button"
                      >
                        Buyer
                      </button>
                      <button
                        onClick={() => {
                          dispatch(setRole("seller"));
                          setDropdownOpen(false);
                          navigate("/vendor/dashboard");
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        type="button"
                      >
                        Seller
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Non-vendor user: Buyer + Be a Seller option */}
              {userInfo && !userInfo.isVendor && !userInfo.isAdmin && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="text-gray-300 hover:text-white flex items-center gap-1"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    type="button"
                  >
                    Buyer <span>▾</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute mt-2 w-40 bg-white text-black rounded shadow-md z-50">
                      {/* Just text Buyer */}
                      <div className="px-4 py-2 text-left cursor-default text-gray-700 select-none">
                        Buyer
                      </div>
                      {/* Be a Seller link */}
                      <button
                        onClick={handleBeSellerClick}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        type="button"
                      >
                        Be a Seller
                      </button>
                    </div>
                  )}
                </div>
              )}

              {userInfo ? (
                <>
                  <div className="relative" ref={profileDropdownRef}>
                    <div
                      onClick={() =>
                        setProfileDropdownOpen(!profileDropdownOpen)
                      }
                      className="flex items-center gap-2 text-gray-300 hover:text-white focus:outline-none"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-300 hover:text-white"
                        aria-label="Profile"
                      >
                        <i className="ri-user-line text-xl" />
                      </Button>
                      <span className="hidden sm:inline">
                        {userInfo.username}
                      </span>
                    </div>
                    {/* Dropdown below the button */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 top-12">
                        <ProfileDropdown />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-white"
                    onClick={logoutHandler}
                    title="Logout"
                    aria-label="Logout"
                  >
                    <i className="ri-logout-box-line text-xl" />
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-white"
                    aria-label="Login"
                  >
                    <i className="ri-login-circle-line text-xl" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
