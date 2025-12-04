import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useProfileMutation,
} from "../../redux/api/usersApiSlice";
import LoadingScreen from "../../components/ui/Loading";
import { useNavigate } from "react-router";

const UpdateProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data: userDetails } = useGetUserDetailsQuery(userInfo?._id);

  const [username, setUsername] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(
    userDetails?.profilePic || null
  );
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [coverPicFile, setCoverPicFile] = useState(null);
  const [coverPicPreview, setCoverPicPreview] = useState("");
const navigate = useNavigate();

  // Address state
  const [province, setProvince] = useState(
    userDetails?.shippingAddress?.province || "Bagmati"
  );
  const [district, setDistrict] = useState(
    userDetails?.shippingAddress?.district || ""
  );
  const [city, setCity] = useState(userDetails?.shippingAddress?.city || "");
  const [street, setStreet] = useState(
    userDetails?.shippingAddress?.street || ""
  );
  const [zipcode, setZipcode] = useState(
    userDetails?.shippingAddress?.zipcode || ""
  );

  const [updateProfile, { isLoading }] = useProfileMutation();

  // Districts in Bagmati Province
  const bagmatiDistricts = [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Kavrepalanchok",
    "Dhading",
    "Sindhupalchok",
    "Rasuwa",
    "Nuwakot",
    "Dhankuta",
    "Sindhuli",
    "Ramechhap",
    "Dolakha",
    "Chitwan",
    "Makwanpur",
    "Rautahat",
    "Bara",
    "Parsa",
  ];

  // Cities based on selected district (simplified mapping)
  const districtCities = {
    Kathmandu: [
      "Kathmandu",
      "Budhanilkantha",
      "Tokha",
      "Kageshwari",
      "Gokarneshwor",
    ],
    Lalitpur: ["Lalitpur", "Mahalaxmi", "Godawari"],
    Bhaktapur: ["Bhaktapur", "Changunarayan", "Madhyapur Thimi"],
    Kavrepalanchok: ["Dhulikhel", "Banepa", "Panauti", "Khopasi"],
    Chitwan: ["Bharatpur", "Kalika", "Rapti", "Ratnanagar"],
    Makwanpur: ["Hetauda", "Thaha", "Bhimphedi"],
    Rautahat: ["Gaur", "Paroha", "Brindaban"],
    Bara: ["Kalaiya", "Jeetpur Simara", "Nijgadh"],
    Parsa: ["Birgunj", "Bahudarmai", "Pakaha Mainpur"],
  };

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username || "");
      setEmail(userDetails.email || "");
      setShopDescription(userDetails.shopDescription || "");
      setShopName(userDetails.shopName || "");
      setProfilePicPreview(userDetails.profilePic || "");
      setCoverPicPreview(userDetails.coverPic || "");

      // Set address fields
      if (userDetails.shippingAddress) {
        setPhoneNumber(userDetails?.shippingAddress?.phone || "");
        setProvince(userDetails?.shippingAddress?.province || "Bagmati");
        setDistrict(userDetails?.shippingAddress?.district || "");
        setCity(userDetails?.shippingAddress?.city || "");
        setStreet(userDetails?.shippingAddress?.street || "");
        setZipcode(userDetails?.shippingAddress?.zipCode || "");
      }
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

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setDistrict(value);
    setCity(""); // Reset city when district changes
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("phoneNumber", phoneNumber);

      if (profilePicFile) {
        formData.append("profilePic", profilePicFile);
      }

      // Add address information
      const address = {
        province: province,
        district: district,
        city: city,
        street: street,
        zipcode: zipcode,
      };
      formData.append("address", JSON.stringify(address));

      // Add vendor-specific fields if user is a vendor
      if (userDetails?.isVendor) {
        formData.append("shopName", shopName);
        formData.append("shopDescription", shopDescription);
        if (coverPicFile) {
          formData.append("coverPic", coverPicFile);
        }
      }

      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Update failed");
    }
  };

  const availableCities = district ? districtCities[district] || [] : [];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-teal-700">
        <h1 className="text-3xl font-bold mb-8 text-center text-teal-700">
          Edit Profile
        </h1>
        <form onSubmit={updateHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Enter your phone number"
                minLength={10}
                maxLength={10}
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base"
              />
            </div>

            <div className="md:col-span-2">
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
                <div className="mt-3 flex justify-center">
                  <img
                    src={profilePicPreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-teal-700"
                  />
                </div>
              )}
            </div>

            {/* Address Section */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Address Information
              </h3>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Province *
              </label>
              <select
                value={province}
                disabled
                className="w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed text-base"
              >
                <option value="Bagmati">Bagmati</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                District *
              </label>
              <select
                value={district}
                onChange={handleDistrictChange}
                required
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base"
              >
                <option value="">Select District</option>
                {bagmatiDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                City *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={!availableCities.length}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base ${
                  availableCities.length
                    ? "bg-white text-gray-800"
                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                }`}
              >
                <option value="">Select City</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                placeholder="Enter your street address"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                required
                placeholder="Enter ZIP code"
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base"
              />
            </div>

            {userDetails?.isVendor && (
              <>
                <div className="md:col-span-2 border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-emerald-600 mb-6 text-center">
                    Vendor Information
                  </h3>
                </div>

                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
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
              </>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-700 to-emerald-400 hover:from-teal-800 hover:to-emerald-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-lg shadow-lg transition duration-200 text-lg tracking-wide"
            >
              {isLoading ? <LoadingScreen /> : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
