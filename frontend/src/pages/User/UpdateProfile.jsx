import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useProfileMutation,
} from "../../redux/api/usersApiSlice";

const UpdateProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data: userDetails } = useGetUserDetailsQuery(userInfo._id);

  console.log(userDetails?.username);

  const [username, setusername] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updateProfile, { isloading }] = useProfileMutation();

  useEffect(() => {
    if (userDetails) {
      // ← Check if data exists
      setusername(userDetails.username);
      setEmail(userDetails.email);
      setShopDescription(userDetails.shopDescription);
      setShopName(userDetails.shopName);
    }
  },[userDetails]);

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const data = {
        username: username,
        shopName: shopName, // ← Add these back
        shopDescription: shopDescription,
      };

      const updatedUser = await updateProfile(data).unwrap();
      toast.success("Profile updated successfully!"); // ← Better message
    } catch (error) {
      console.log(error);
      toast.error(error.data?.message || "Update failed"); // ← Better error handling
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a1120]">
      <div className="w-full max-w-md bg-[#131a2b] rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          <span className="text-[#1de9b6]">Profile</span>
        </h1>
        <form onSubmit={updateHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1de9b6] mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              className="w-full px-4 py-2 border border-[#1de9b6] bg-[#0a1120] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1de9b6] mb-1">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
              className="w-full px-4 py-2 border border-[#1de9b6] bg-[#0a1120] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6] cursor-not-allowed opacity-80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1de9b6] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#1de9b6] bg-[#0a1120] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1de9b6] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#1de9b6] bg-[#0a1120] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
            />
          </div>
          {userDetails?.isVendor && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#1de9b6] mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-4 py-2 border border-[#1de9b6] bg-[#0a1120] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1de9b6] mb-1">
                  Shop Description
                </label>
                <input
                  type="text"
                  value={shopDescription}
                  onChange={(e) => setShopDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-[#1de9b6] bg-[#0a1120] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-[#1de9b6] hover:bg-[#15bfae] text-[#0a1120] font-semibold rounded-lg shadow-md transition duration-200"
          >
            UPDATE
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
