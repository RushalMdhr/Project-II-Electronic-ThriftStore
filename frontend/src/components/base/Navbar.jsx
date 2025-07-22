import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import "remixicon/fonts/remixicon.css";


const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  // Search submit handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const Search = encodeURIComponent(search.trim());
      navigate(`/products?keyword=${Search}`, { state: { Search } });
    } else {
      navigate("/products");
    }
  };

  // Spacer div to create space for the fixed navbar
  return (
    <>
      <div className="h-16 w-full" />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center mr-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-emerald-400">
                  Thrift
                </div>
                <div className="text-2xl font-bold text-white">Tech</div>
              </Link>
            </div>


            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Products
              </Link>
              <Link
                to="/admin/categories"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Categories
              </Link>
              {userInfo?.isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              {userInfo && userInfo.isVendor ? (
                <>
                  <Link
                    to="/vendor/dashboard"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/vendor/upload"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Upload
                  </Link>
                </>
              ) : (
                <Link
                  to="/vendor/register"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Vendors
                </Link>
              )}

            </div>

            {/* Search Bar */}
            <form
              className="hidden md:flex items-center flex-1 max-w-md mx-8"
              onSubmit={handleSearch}
            >
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <button type="submit" className="focus:outline-none">
                    <i className="ri-search-line"></i>
                  </button>
                </span>
                <Input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSearch(e); }}
                  placeholder="Search for products..."
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-400"
                />
              </div>
            </form>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white"
              >
                <i className="ri-heart-line text-xl"></i>
              </Button>
              <Link
                to="/cart"
                className="text-gray-300 hover:text-white transition-colors"
              >

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white"
                >
                  <i className="ri-shopping-cart-line text-xl"></i>
                </Button>
              </Link>
              {userInfo ? (
                <>
                  <Link to="/profile">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-white"
                    >
                      <i className="ri-user-line text-xl"></i>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-white"
                    onClick={logoutHandler}
                    title="Logout"
                  >
                    <i className="ri-logout-box-line text-xl"></i>
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-white"
                  >
                    <i className="ri-login-circle-line text-xl"></i>
                  </Button>
                </Link>
              )}
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <i
                  className={`ri-${isMenuOpen ? "close-line" : "menu-line"
                    } text-xl`}
                ></i>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                <form onSubmit={handleSearch} className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <button type="submit" className="focus:outline-none">
                      <i className="ri-search-line"></i>
                    </button>
                  </span>
                  <Input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleSearch(e); }}
                    placeholder="Search for products..."
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  />
                </form>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  Home
                </Link>
                <Link
                  to="/admin/productcard"
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  Products
                </Link>
                <Link
                  to="/admin/categories"
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  Categories
                </Link>
                {userInfo?.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-300 hover:text-white transition-colors py-2"
                  >
                    Admin Panel
                  </Link>
                )}
                {userInfo && userInfo.isVendor ? (
                  <>
                    <Link
                      to="/vendor/dashboard"
                      className="text-gray-300 hover:text-white transition-colors py-2"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/vendor/upload"
                      className="text-gray-300 hover:text-white transition-colors py-2"
                    >
                      Upload
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/vendor/register"
                    className="text-gray-300 hover:text-white transition-colors py-2"
                  >
                    Vendors
                  </Link>
                )}
                <Link
                  to="#"
                  className="text-gray-300 hover:text-white transition-colors py-2"
                >
                  Blog
                </Link>
                {userInfo ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-white"
                    onClick={logoutHandler}
                    title="Logout"
                  >
                    <i className="ri-logout-box-line text-xl"></i>
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-white"
                    >
                      <i className="ri-login-circle-line text-xl"></i>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
