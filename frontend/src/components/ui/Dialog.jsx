// Dialog Wrapper with backdrop and animation
export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      {/* Modal box */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-fadeIn border border-slate-700">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-light"
          onClick={onClose}
          aria-label="Close Dialog"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
};

// DialogHeader: keeps spacing consistent
export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

// DialogTitle: clean typography
export const DialogTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold tracking-tight">{children}</h2>
);

// DialogContent: flexible content area
export const DialogContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

// Optional DialogFooter
export const DialogFooter = ({ children }) => (
  <div className="mt-6 flex justify-end space-x-2">{children}</div>
);
