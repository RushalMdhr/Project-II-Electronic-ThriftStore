import React from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const UserCard = ({ user, onDelete, onView }) => {
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.username}?`
    );
    if (confirmDelete) {
      onDelete(user._id);
    }
  };

  const handleView = () => {
    onView(user);
  };

  return (
    <div className="w-[65%] mx-auto">
      <div className="flex items-center justify-between bg-[#0a101e] rounded-xl px-5 py-4 transition-colors duration-300 hover:bg-[#202532] shadow-sm">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || "https://i.pravatar.cc/150?img=3"}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-gray-100 font-semibold text-lg">
              {user.username}
            </h3>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="text-gray-300 hover:text-[#1de9b6] p-2 rounded transition-colors duration-300"
            title="View"
            onClick={handleView}
          >
            <FiEye size={20} />
          </button>
          <Link
            to={`/admin/users/${user._id}/edit`}
            className="text-gray-300 hover:text-[#1de9b6] p-2 rounded transition-colors duration-300"
            title="Edit"
          >
            <FiEdit size={20} />
          </Link>
          <button
            className="text-gray-300 hover:text-red-500 p-2 rounded transition-colors duration-300"
            title="Delete"
            onClick={handleDelete}
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
