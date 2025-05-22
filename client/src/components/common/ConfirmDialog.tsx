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
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  // Auto-close after a timeout (optional)
  useEffect(() => {
    if (!isOpen) return;

    // Auto-close safety (optional - enable if you want it to auto-close)
    // const timer = setTimeout(() => onCancel(), 10000);
    // return () => clearTimeout(timer);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b border-gray-100">
          <h3 className="font-medium text-gray-800 text-sm">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-3 text-gray-600 text-sm">
          <p>{message}</p>
        </div>

        <div className="px-3 pb-3 pt-1 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
