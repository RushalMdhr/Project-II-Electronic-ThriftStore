import React from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import "../../styles/UserCard.css";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../redux/features/users/userSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.username}?`
    );
    if (confirmDelete) {
      dispatch(deleteUser(user._id))
        .unwrap()
        .then(() => alert(`${user.username} has been deleted`))
        .catch((err) => alert("Delete failed: " + err));
    }
  };

  const handleEdit = () => {
    console.log("Edit user:", user);
    // You can trigger modal or navigate here
  };

  const handleView = () => {
    console.log("View user:", user);
  };

  return (
    <div className="user-card-wrapper">
      <div className="user-card">
        <div className="user-avatar">
          <img
            src={user.avatar || "https://i.pravatar.cc/150?img=3"}
            alt={user.username}
          />
        </div>
        <div className="user-info">
          <h3>{user.username}</h3>
          <p>{user.email}</p>
        </div>
        <div className="user-actions">
          <button className="action-btn" title="View" onClick={handleView}>
            <FiEye />
          </button>
          <button className="action-btn" title="Edit" onClick={handleEdit}>
            <FiEdit />
          </button>
          <button className="action-btn" title="Delete" onClick={handleDelete}>
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
