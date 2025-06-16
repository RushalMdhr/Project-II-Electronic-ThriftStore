import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/base/Loader";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isloading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password donot match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Registration Sucessful");
        toast.success(`Logged as '${username}'`);
      } catch (error) {
        console.error(error);
        toast.error(error?.data?.message || error.message || "Register failed");
      }
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">register</button>
        <div>
          already have an account ?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-red-700  ">Login</Link>
        </div>
      </form>
    </>
    // <div>
    //   <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a101f]">
    //     <div className="w-full max-w-md p-8 bg-[#10182a] rounded-lg shadow-md">
    //       <h2 className="text-2xl font-bold text-white text-center mb-2">
    //         Create an Account
    //       </h2>
    //       <p className="text-sm text-gray-400 text-center mb-6">
    //         Join ThriftTech to start buying or selling tech products
    //       </p>
    //       <form onSubmit={handleSubmit} className="space-y-4">
    //         <div className="flex gap-4">
    //           <div className="flex-1">
    //             <label className="block text-sm text-gray-300 mb-1">
    //               First Name
    //             </label>
    //             <input
    //               type="text"
    //               id="firstName"
    //               className="w-full px-3 py-2 bg-[#181f33] border border-[#232c47] rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
    //               placeholder="First Name"
    //               value={firstName}
    //               onChange={(e) => setFirstName(e.target.value)}
    //             />
    //           </div>
    //           <div className="flex-1">
    //             <label className="block text-sm text-gray-300 mb-1">
    //               Last Name
    //             </label>
    //             <input
    //               type="text"
    //               id="lastName"
    //               className="w-full px-3 py-2 bg-[#181f33] border border-[#232c47] rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
    //               placeholder="Last Name"
    //               value={lastName}
    //               onChange={(e) => setLastName(e.target.value)}
    //             />
    //           </div>
    //         </div>
    //         <div>
    //           <label className="block text-sm text-gray-300 mb-1">
    //             Username
    //           </label>
    //           <input
    //             type="text"
    //             className="w-full px-3 py-2 bg-[#181f33] border border-[#232c47] rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
    //             placeholder="username"
    //             value={username}
    //             onChange={(e) => setusername(e.target.value)}
    //           />
    //         </div>
    //         <div>
    //           <label className="block text-sm text-gray-300 mb-1">Email</label>
    //           <input
    //             type="email"
    //             className="w-full px-3 py-2 bg-[#181f33] border border-[#232c47] rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
    //             placeholder="name@example.com"
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //           />
    //         </div>
    //         <div>
    //           <label className="block text-sm text-gray-300 mb-1">
    //             Account Type
    //           </label>
    //           <select className="w-full px-3 py-2 bg-[#181f33] border border-[#232c47] rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
    //             <option>Customer</option>
    //             <option>Vendor</option>
    //           </select>
    //         </div>
    //         <div>
    //           <label className="block text-sm text-gray-300 mb-1">
    //             Password
    //           </label>
    //           <input
    //             type="password"
    //             className="w-full px-3 py-2 bg-[#181f33] border border-[#232c47] rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
    //             placeholder="Password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //           />
    //         </div>
    //         <div>
    //           <label className="block text-sm text-gray-300 mb-1">
    //             Confirm Password
    //           </label>
    //           <input
    //             type="password"
    //             className="w-full px-3 py-2 bg-[#181f33] border border-[#232c47] rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
    //             placeholder="Confirm Password"
    //             value={confirmPassword}
    //             onChange={(e) => setConfirmPassword(e.target.value)}
    //           />
    //         </div>
    //         <div className="flex items-center">
    //           <input
    //             type="checkbox"
    //             id="terms"
    //             className="mr-2 accent-teal-500"
    //           />
    //           <label htmlFor="terms" className="text-xs text-gray-400">
    //             I agree to the{" "}
    //             <a href="#" className="text-teal-400 underline">
    //               Terms of Service
    //             </a>{" "}
    //             and{" "}
    //             <a href="#" className="text-teal-400 underline">
    //               Privacy Policy
    //             </a>
    //           </label>
    //         </div>
    //         <button
    //           disabled={isloading}
    //           type="submit"
    //           className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded font-semibold flex items-center justify-center gap-2"
    //         >
    //           {isloading ? "Signing In..." : "Sign In"}
    //           <svg
    //             className="w-5 h-5"
    //             fill="none"
    //             stroke="currentColor"
    //             strokeWidth="2"
    //             viewBox="0 0 24 24"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
    //             ></path>
    //             <circle cx="12" cy="7" r="4"></circle>
    //           </svg>
    //           Create Account
    //         </button>
    //         {isloading && <Loader />}
    //       </form>
    //       <div className="text-center mt-4 text-sm text-gray-400">
    //         Already have an account?{" "}
    //         <Link
    //           to={redirect ? `/login?redirect=${redirect}` : "/login"}
    //           className="text-teal-400 hover:underline"
    //         >
    //           Sign in
    //         </Link>
    //       </div>
    //       <div className="flex items-center my-4">
    //         <div className="flex-grow h-px bg-[#232c47]"></div>
    //         <span className="mx-2 text-xs text-gray-500">OR CONTINUE WITH</span>
    //         <div className="flex-grow h-px bg-[#232c47]"></div>
    //       </div>
    //       <div className="flex gap-4">
    //         <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#181f33] border border-[#232c47] rounded text-white hover:bg-[#232c47]">
    //           <img
    //             src="https://www.svgrepo.com/show/475656/google-color.svg"
    //             alt="Google"
    //             className="w-5 h-5"
    //           />
    //           Google
    //         </button>
    //         <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#181f33] border border-[#232c47] rounded text-white hover:bg-[#232c47]">
    //           <img
    //             src="https://www.svgrepo.com/show/475645/facebook-color.svg"
    //             alt="Facebook"
    //             className="w-5 h-5"
    //           />
    //           Facebook
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Register;
