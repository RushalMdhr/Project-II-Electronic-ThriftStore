import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, isError, error } = useGetUserDetailsQuery(id);
  user && console.log("Fetched user data:", user);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    isUser: false,
    isVendor: false,
    isAdmin: false,
    status: "active",
    password: "",
  });

  // ===== Admin Risk Calculation =====
  const sales = user?.sales || 0;
  const blackListStreak = user?.blackListStreak || 0;

  const riskLimit = sales / 5;
  const isBannedRisk = blackListStreak > riskLimit;

  // Good chance calculation (inverse risk)
  let goodChance = 100;

  if(sales===0 && blackListStreak>0){
    goodChance = 0;
  }
  else if(sales===0 && blackListStreak===0){
    goodChance = 100;
  }
  else{
    goodChance = 100 - (blackListStreak / sales * 100).toFixed(2);
  }

  let riskColor = "text-green-400";
  let riskLabel = "Good";

  if (goodChance < 80) {
    riskColor = "text-orange-400";
    riskLabel = "Okay";
  }

  if (goodChance < 30 || isBannedRisk) {
    riskColor = "text-red-500";
    riskLabel = isBannedRisk ? "BANNED RISK" : "Bad";
  }

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        isUser: user.isUser || false,
        isVendor: user.isVendor || false,
        isAdmin: user.isAdmin || false,
        status: user.status || "active",
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId: id, ...formData }).unwrap();
      alert("User updated successfully");
      navigate(-1);
    } catch (err) {
      alert("Update failed: " + (err?.data?.message || err.error));
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        Loading user data...
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center">
        Error: {error?.data?.message || error.error}
      </div>
    );

  // Color classes for status
  const statusColors = {
    active: "bg-green-500",
    inactive: "bg-yellow-400",
    banned: "bg-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full sm:w-[600px] bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold mb-8 text-center pb-5">
          Update User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <input
            type="text"
            value={formData.username}
            disabled
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Username"
          />

          {/* Email */}
          <input
            type="email"
            value={formData.email}
            disabled
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Email"
          />

          {/* ===== Admin Risk Analytics ===== */}
          <div className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-300">
              Risk Analytics (Admin Only)
            </h3>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Sales</span>
              <span className="text-white font-semibold">{sales}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Blacklist Streak</span>
              <span className="text-white font-semibold">
                {blackListStreak}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Banned Threshold</span>
              <span className="text-white font-semibold">
                {riskLimit.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
              <span className="text-gray-300 font-medium">Good Chance</span>
              <span className={`font-bold ${riskColor}`}>
                {goodChance}% — {riskLabel}
              </span>
            </div>
          </div>

          {/* Status segmented control */}
          <div className="w-full">
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              Status
            </label>

            <div className="inline-flex rounded-lg bg-gray-800 shadow-sm overflow-hidden select-none">
              {["active", "inactive", "banned"].map((statusOption) => (
                <button
                  key={statusOption}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, status: statusOption })
                  }
                  className={`px-5 py-2 text-sm font-medium transition
                    ${
                      formData.status === statusOption
                        ? `${statusColors[statusOption]} text-white`
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Role toggles */}
          <div className="flex justify-between items-center gap-6">
            {[
              { key: "isUser", label: "User" },
              { key: "isVendor", label: "Vendor" },
              { key: "isAdmin", label: "Admin" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.checked })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full shadow-inner transition duration-200
                    ${formData[key] ? "bg-green-500" : "bg-gray-600"}`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition duration-200
                    ${formData[key] ? "translate-x-5" : ""}`}
                ></div>
                <span className="ml-3 text-sm font-medium text-gray-300">
                  {label}
                </span>
              </label>
            ))}
          </div>

          {/* Password - optional */}
          <input
            type="password"
            value={formData.password || ""}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="New password (leave blank to keep current)"
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdate;
