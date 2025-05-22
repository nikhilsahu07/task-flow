import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  position?: 'top-right' | 'top-middle';
  variant?: 'danger' | 'primary';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  position = 'top-right',
  variant = 'danger',
}) => {
  // Auto-close after a timeout (optional)
  useEffect(() => {
    if (!isOpen) return;

    // Auto-close safety (optional - enable if you want it to auto-close)
    // const timer = setTimeout(() => onCancel(), 10000);
    // return () => clearTimeout(timer);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const positionClasses = {
    'top-right': 'top-5 right-5',
    'top-middle': 'top-5 left-1/2 -translate-x-1/2',
  };

  const widthClasses = {
    'top-right': 'max-w-sm',
    'top-middle': 'w-[350px]',
  };

  const buttonVariants = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 ${widthClasses[position]} animate-fadeIn`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 text-gray-600 text-sm">
          <p>{message}</p>
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm ${buttonVariants[variant]} rounded transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
