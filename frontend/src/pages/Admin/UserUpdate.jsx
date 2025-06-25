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
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    isUser: false,
    isVendor: false,
    isAdmin: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        isUser: user.isUser || false,
        isVendor: user.isVendor || false,
        isAdmin: user.isAdmin || false,
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
      <div className="w-full sm:w-[60%] bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold mb-8 text-center pb-5">Update User</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Username"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
          <div className="flex justify-between items-center gap-6">
            {[
              { key: "isUser", label: "User" },
              { key: "isVendor", label: "Vendor" },
              { key: "isAdmin", label: "Admin" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.checked })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-11 h-6 rounded-full shadow-inner transition duration-200 ${
                        formData[key] ? "bg-green-500" : "bg-gray-600"
                      }`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition duration-200 ${
                        formData[key] ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm">{label}</span>
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-md transition"
          >
            {isUpdating ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdate;
