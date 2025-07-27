import React, { useState } from "react";
import { X } from "lucide-react";

const requiredText = "I understand that deleting this item is permanent and cannot be undone.";

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteConfirmationModal: React.FC<Props> = ({ onClose, onConfirm }) => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const isMatch = inputText === requiredText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-bold mb-4 text-red-600">
          Are you absolutely sure?
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          This action cannot be undone. Please type the sentence below to confirm:
        </p>
        <p className="text-sm font-medium italic bg-gray-100 dark:bg-gray-700 p-2 rounded border mb-2">
          {requiredText}
        </p>
        <input
          value={inputText}
          onChange={handleInputChange}
          onCopy={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
          className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-900 dark:text-white"
          placeholder="Type the sentence exactly..."
        />
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          disabled={!isMatch}
          className={`mt-4 w-full py-2 rounded text-white font-semibold transition ${
            isMatch
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-300 cursor-not-allowed"
          }`}
        >
          Confirm Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
