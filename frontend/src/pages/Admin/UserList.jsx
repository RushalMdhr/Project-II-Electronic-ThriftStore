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

  if (isLoading)
    return <div className="text-center mt-10">Loading users...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500 mt-10">
        Error: {error?.data?.message || error.error}
      </div>
    );
  if (!users || users.length === 0)
    return <div className="text-center mt-10">No users found.</div>;

  return (
    <>
      <div className="flex flex-col gap-4 px-4 py-6">
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
    </>
  );
};

export default UserList;
