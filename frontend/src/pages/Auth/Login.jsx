import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
// import Navbar from "../../components/base/Navbar"; // Uncomment if you want the navbar on login

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success(
        `Logged in as '${res.username || res.user?.username || email}'`
      );
    } catch (error) {
      toast.error(error?.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* <Navbar /> */}
      <div className="pt-20 flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome Back
            </CardTitle>
            <p className="text-gray-400">Sign in to your ThriftTech account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={loginHandler} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Sign In"}
              </Button>

              {/* Google Login Button */}
              <div className="mt-6">
                <a
                  href="http://localhost:5000/api/auth/google"
                  className="flex items-center justify-center gap-2 bg-white border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
                >
                  <img
                    src="https://img.icons8.com/color/24/000000/google-logo.png"
                    alt="Google"
                  />
                  Continue with Google
                </a>
              </div>

              <div className="text-center">
                <span className="text-gray-400">Don't have an account? </span>
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
