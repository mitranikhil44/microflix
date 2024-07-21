import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;


  return (
    <div className={`bg-gray-700 bg-opacity-50 w-full rounded-md`}>
      <div className="mx-auto">
        <div className="bg-p-2 rounded-lg shadow-lg">
          <button
            className="absolute top-2 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
