import * as React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, children }) => {
  if (typeof window === 'undefined') return null;
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-gray-900 rounded-xl p-4 max-w-full w-[90%] md:w-[600px] shadow-lg">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-3 text-white text-xl font-bold"
        >
          ×
        </button>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};
