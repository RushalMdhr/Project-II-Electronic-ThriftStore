import React, { useState } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/usersApiSlice.js";
import UserCard from "../../components/Admin/UserCard";

const UserList = () => {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      console.log("User deleted:", userId);
    } catch (err) {
      alert("Failed to delete user: " + (err?.data?.message || err.error));
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a1120] text-white min-h-screen flex justify-center items-center">
        Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0a1120] text-red-500 min-h-screen flex justify-center items-center">
        Error: {error?.data?.message || error.error}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-[#0a1120] text-white min-h-screen flex justify-center items-center">
        No users found.
      </div>
    );
  }

  return (
    <div className="bg-[#131a2b] min-h-screen px-10 py-6">
      
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
        <div>
          <h2 className="text-3xl text-[#1de9b6] font-bold">User Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            View, edit, and manage all registered users.
          </p>
        </div>
        <div>
          <span className="text-m bg-[#1de9b6]/10 text-[#1de9b6] px-3 py-1 rounded-full font-medium">
            Total: {users.length}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </div>

      {selectedUser && (
        <>
          {/* Blur background */}
          <div
            className="fixed inset-0 backdrop-blur-sm z-40"
            onClick={() => setSelectedUser(null)}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-slate-800 rounded-xl p-6 w-96 relative pointer-events-auto shadow-[0_0_15px_4px_rgba(59,130,246,0.7)]">
              <button
                className="absolute top-2 right-3 text-gray-100 text-2xl hover:text-red-500"
                onClick={() => setSelectedUser(null)}
                aria-label="Close modal"
              >
                &times;
              </button>
              <div className="flex flex-col items-center">
                <img
                  src={selectedUser.avatar || "https://i.pravatar.cc/150?img=3"}
                  alt={selectedUser.username}
                  className="w-28 h-28 rounded-full object-cover mb-4"
                />
                <h2 className="text-xl text-gray-50 font-semibold mb-2">
                  {selectedUser.username}
                </h2>
                <p className="text-gray-400 mb-4">{selectedUser.email}</p>

                {/* Roles badges */}
                <div className="flex gap-2">
                  {selectedUser.isUser && (
                    <span className="px-3 py-1 rounded-full bg-blue-200 text-blue-800 text-sm font-medium">
                      User
                    </span>
                  )}
                  {selectedUser.isVendor && (
                    <span className="px-3 py-1 rounded-full bg-green-200 text-green-800 text-sm font-medium">
                      Vendor
                    </span>
                  )}
                  {selectedUser.isAdmin && (
                    <span className="px-3 py-1 rounded-full bg-red-200 text-red-800 text-sm font-medium">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
