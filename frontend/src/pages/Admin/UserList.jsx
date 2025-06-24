// components/Admin/UserList.jsx
import React from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/usersApiSlice.js";
import UserCard from "../../components/Admin/UserCard";

const UserList = () => {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      console.log("User deleted:", userId);
    } catch (err) {
      alert("Failed to delete user: " + (err?.data?.message || err.error));
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error: {error?.data?.message || error.error}</div>;
  if (users.length === 0) return <div>No users found.</div>;

  return (
    <div className="user-list">
      {users.map((user) => (
        <UserCard key={user._id} user={user} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default UserList;
