import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMakeVendorMutation } from "../../redux/api/usersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials, setRole } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

export default function SellerRegister() {
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    province: "Bagmati", // Only Bagmati is available
    district: "",
    city: "",
    phone: "",
  });

  const [makeVendor] = useMakeVendorMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset city when district changes
    if (name === "district") {
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.phone.length < 10) {
        return toast.error("Phone number must be at least 10 digits");
      }
      toast.success("Processing your request...");
      await makeVendor({
        shopName: formData.shopName,
        shopDescription: formData.shopDescription,
        shopAddress: {
          province: formData.province,
          district: formData.district,
          city: formData.city,
        },
        phone: formData.phone,
      }).unwrap();
      toast.success("Processing your requested");
      console.log("formData : ", formData.phone.length);

      // Fetch updated user info and update Redux state
      const res = await fetch("/api/users/profile", { credentials: "include" });
      if (res.ok) {
        const user = await res.json();
        dispatch(setCredentials(user));

        // Also update role separately
        dispatch(setRole("seller"));
      }
      toast.info("Seller shop info updated!");
      toast.success("You are now a seller!");
      navigate("/vendor/dashboard");
    } catch (err) {
      toast.error("Failed to update seller info");
    }
  };

  const availableCities = formData.district
    ? districtCities[formData.district] || []
    : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-teal-700">
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-8 tracking-tight">
          Become a Seller
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="shopName"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Shop Name *
            </label>
            <input
              type="text"
              name="shopName"
              id="shopName"
              placeholder="Enter your shop name"
              value={formData.shopName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base"
            />
          </div>

          <div>
            <label
              htmlFor="shopDescription"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Shop Description *
            </label>
            <textarea
              name="shopDescription"
              id="shopDescription"
              placeholder="Describe your shop"
              value={formData.shopDescription}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={10}
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-base"
            />
          </div>

          <div>
            <label
              htmlFor="province"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Province *
            </label>
            <select
              name="province"
              id="province"
              value={formData.province}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed text-base"
            >
              <option value="Bagmati">Bagmati</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="district"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              District *
            </label>
            <select
              name="district"
              id="district"
              value={formData.district}
              onChange={handleChange}
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
            <label
              htmlFor="city"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              City *
            </label>
            <select
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-emerald-400 hover:from-teal-800 hover:to-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg transition duration-200 text-lg tracking-wide"
          >
            Become a Seller
          </button>
        </form>
      </div>
    </div>
  );
}
