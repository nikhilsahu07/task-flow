import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  position?: 'top-right' | 'top-middle';
  variant?: 'danger' | 'primary' | 'success';
  showBackdrop?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  position = 'top-right',
  variant = 'primary',
  showBackdrop = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-middle': 'top-6 left-1/2 -translate-x-1/2',
  };

  const widthClasses = {
    'top-right': 'w-72',
    'top-middle': 'w-72',
  };

  const buttonVariants = {
    danger:
      'bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30',
    primary:
      'bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30',
    success:
      'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30',
  };

  return (
    <>
      {/* Backdrop at true only when needed */}
      {showBackdrop && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={onCancel}
        />
      )}

      {/* Dialog */}
      <div
        className={`fixed ${positionClasses[position]} z-50 ${widthClasses[position]} animate-slideIn`}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-md p-1 z-10"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Content */}
          <div className="p-4 pr-10">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-base mb-2 leading-tight">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              {message}
            </p>

            {/* Confirm button */}
            <div className="flex justify-end">
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-medium ${buttonVariants[variant]} rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 dark:focus:ring-offset-gray-900`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
