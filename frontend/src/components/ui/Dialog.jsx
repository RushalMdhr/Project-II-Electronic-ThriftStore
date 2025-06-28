import React from "react";

export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-xl max-w-2xl w-full relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => (
  <div className="mb-4 border-b border-gray-600 pb-2">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

export const DialogContent = ({ children }) => <div>{children}</div>;
