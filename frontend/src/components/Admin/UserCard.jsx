import React from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const statusColors = {
  active: "bg-green-500 text-white",
  inactive: "bg-yellow-400 text-black",
  banned: "bg-red-600 text-white",
};

const UserCard = ({ user, onDelete, onView }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      onDelete(user._id);
    }
  };

  const handleView = () => {
    onView(user);
  };

  const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

  return (
    <div className="w-[90%] max-w-3xl mx-auto my-3">
      <div className="flex flex-col sm:flex-row sm:items-center bg-[#0a101e] rounded-xl px-6 py-5 transition-colors duration-300 hover:bg-[#202532] shadow-sm gap-4 sm:gap-0 flex-wrap">
        {/* Avatar and user info */}
        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
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

        {/* Status badge */}
        <span
          className={`inline-block px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap self-center ${
            statusColors[user.status] || "bg-gray-400 text-white"
          }`}
        >
          {capitalize(user.status)}
        </span>

        {/* Actions */}
        <div className="flex gap-4 justify-end flex-wrap min-w-[150px]">
          <button
            onClick={handleView}
            title="View"
            className="text-gray-300 hover:text-[#1de9b6] p-2 rounded transition duration-300"
          >
            <FiEye size={20} />
          </button>
          <Link
            to={`/admin/users/${user._id}/edit`}
            title="Edit"
            className="text-gray-300 hover:text-[#1de9b6] p-2 rounded transition duration-300"
          >
            <FiEdit size={20} />
          </Link>
          <button
            onClick={handleDelete}
            title="Delete"
            className="text-gray-300 hover:text-red-500 p-2 rounded transition duration-300"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
