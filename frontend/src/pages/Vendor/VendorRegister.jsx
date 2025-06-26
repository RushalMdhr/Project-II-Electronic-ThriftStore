import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMakeVendorMutation,
  useGetCurrentUserQuery,
} from "../../redux/api/usersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";

export default function VendorRegister() {
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
  });

  const [makeVendor] = useMakeVendorMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await makeVendor({
        shopName: formData.shopName,
        shopDescription: formData.shopDescription,
      }).unwrap();
      // Fetch updated user info and update Redux state
      const res = await fetch("/api/users/profile", { credentials: "include" });
      if (res.ok) {
        const user = await res.json();
        dispatch(setCredentials(user));
      }
      alert("Vendor shop info updated!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to update vendor info");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1120] py-8 px-4">
      <div className="w-full max-w-md bg-[#131a2b] rounded-3xl shadow-2xl p-10 mt-8 border border-[#1de9b6]">
        <h2 className="text-3xl font-extrabold text-center text-[#1de9b6] mb-8 tracking-tight drop-shadow-lg">
          Become a Vendor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="shopName"
              className="block text-lg font-semibold text-white mb-2"
            >
              Shop Name
            </label>
            <input
              type="text"
              name="shopName"
              id="shopName"
              placeholder="Enter your shop name"
              value={formData.shopName}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-[#1de9b6] bg-[#0a1120] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1de9b6] text-lg shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="shopDescription"
              className="block text-lg font-semibold text-white mb-2"
            >
              Shop Description
            </label>
            <textarea
              name="shopDescription"
              id="shopDescription"
              placeholder="Describe your shop"
              value={formData.shopDescription}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-5 py-3 border border-[#1de9b6] bg-[#0a1120] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1de9b6] text-lg shadow-sm resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1de9b6] to-blue-500 hover:from-[#1de9b6] hover:to-blue-600 text-[#0a1120] font-bold py-3 rounded-xl shadow-lg transition duration-200 text-lg tracking-wide"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}