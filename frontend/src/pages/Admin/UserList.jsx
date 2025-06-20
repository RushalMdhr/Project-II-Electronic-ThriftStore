// components/UserList.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser } from "../../redux/features/users/userSlice";
import UserCard from "../../components/Admin/UserCard";


const UserList = () => {
  const dispatch = useDispatch();
  const { list: users, status, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId))
      .unwrap()
      .then(() => console.log("User deleted:", userId))
      .catch((err) => alert("Failed to delete user: " + err));
  };

  if (status === "loading") return <div>Loading users...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  if (status === "succeeded" && users.length === 0)
    return <div>No users found.</div>;

  return (
    <div className="user-list">
      {users.map((user) => (
        <UserCard key={user._id} user={user} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default UserList;
