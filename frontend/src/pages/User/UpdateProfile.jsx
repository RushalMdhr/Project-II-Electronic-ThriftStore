import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useProfileMutation,
} from "../../redux/api/usersApiSlice";
import LoadingScreen from "../../components/ui/Loading";

const UpdateProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data: userDetails } = useGetUserDetailsQuery(userInfo?._id);

  const [username, setUsername] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [coverPicFile, setCoverPicFile] = useState(null);
  const [coverPicPreview, setCoverPicPreview] = useState("");

  const [updateProfile, { isLoading }] = useProfileMutation();

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username || "");
      setEmail(userDetails.email || "");
      setShopDescription(userDetails.shopDescription || "");
      setShopName(userDetails.shopName || "");
      setProfilePicPreview(userDetails.profilePic || "");
      setCoverPicPreview(userDetails.coverPic || "");
    }
  }, [userDetails]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePicFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPicChange = (e) => {
    const file = e.target.files[0];
    setCoverPicFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      
      if (profilePicFile) {
        formData.append('profilePic', profilePicFile);
      }

      // Add vendor-specific fields if user is a vendor
      if (userDetails?.isVendor) {
        formData.append('shopName', shopName);
        formData.append('shopDescription', shopDescription);
        if (coverPicFile) {
          formData.append('coverPic', coverPicFile);
        }
      }

      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Update failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-teal-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-700">
          Edit Profile
        </h1>
        <form onSubmit={updateHandler} className="space-y-5">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed opacity-80 text-base"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Profile Picture *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-700 file:text-white hover:file:bg-teal-800"
            />
            {profilePicPreview && (
              <div className="mt-3">
                <img
                  src={profilePicPreview}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-teal-700"
                />
              </div>
            )}
          </div>

          {userDetails?.isVendor && (
            <>
              <div className="border-t border-gray-200 pt-5">
                <h3 className="text-xl font-semibold text-emerald-600 mb-4 text-center">
                  Vendor Information
                </h3>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    Shop Description *
                  </label>
                  <textarea
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    Shop Banner/ Cover Picture *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverPicChange}
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-400 file:text-gray-800 hover:file:bg-emerald-500"
                  />
                  {coverPicPreview && (
                    <div className="mt-3">
                      <img
                        src={coverPicPreview}
                        alt="Cover preview"
                        className="w-full h-32 object-cover rounded-lg border-2 border-emerald-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-teal-700 to-emerald-400 hover:from-teal-800 hover:to-emerald-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-lg shadow-lg transition duration-200 text-lg tracking-wide"
          >
            {isLoading ? <LoadingScreen/> : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
