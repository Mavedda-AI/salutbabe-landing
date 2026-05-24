"use client";

import React, {useEffect} from "react";

interface CustomToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({ show, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed left-4 bottom-4 z-9999 bg-pink-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center animate-toast-slide">
      <span className="font-bold text-base">{message}</span>
    </div>
  );
};

export default CustomToast;
