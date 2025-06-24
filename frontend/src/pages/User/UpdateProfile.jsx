import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation, useUpdateUserMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const UpdateProfile = () => {

    const { userInfo } = useSelector((state) => state.auth);
    
      const [username, setusername] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
    
      const [updateProfile, { isloading }] = useProfileMutation();
    
      useEffect(() => {
        setusername(userInfo.username);
        setEmail(userInfo.email);
      }, [userInfo.username, userInfo.email]);
    
      const dispatch = useDispatch();
    
      const updateHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
        } else {
          try {
            const res = await updateProfile({
              _id: userInfo._id,
              username,
              email,
              password,
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.info("Profile Sucessfully Updated");
          } catch (error) {
            toast.error(error?.data?.message || error.message);
          }
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
          <label className="block text-sm font-medium text-[#1de9b6] mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            className="w-full px-4 py-2 border border-[#1de9b6] bg-[#0a1120] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1de9b6] mb-1">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-[#1de9b6] bg-[#0a1120] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1de9b6] mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[#1de9b6] bg-[#0a1120] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1de9b6] mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[#1de9b6] bg-[#0a1120] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-2 bg-[#1de9b6] hover:bg-[#15bfae] text-[#0a1120] font-semibold rounded-lg shadow-md transition duration-200"
        >
          UPDATE
        </button>
      </form>
    </div>
  </div>
  )
}

export default UpdateProfile
