import { X, User, Phone, Mail, DollarSign, Calendar } from "lucide-react";
import React from "react";

type TConsultationDetailsProps = {
  consultation: {
    userId: string;
    userName: string;
    userPhoneNumber: string;
    userEmail?: string;
    consultantId: string;
    consultantName: string;
    consultantPhoneNumber: string;
    consultantEmail?: string;
    concern?: string;
    fees: string;
    scheduledAt?: Date;
    status?: "pending" | "completed";
  };
  onClose: () => void;
};

const ConsultationDetails: React.FC<TConsultationDetailsProps> = ({
  consultation,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Consultation Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {consultation.userName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {consultation.userPhoneNumber}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {consultation.userEmail || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Consultant Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Consultant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {consultation.consultantName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {consultation.consultantPhoneNumber}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {consultation.consultantEmail || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Consultation Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {consultation.scheduledAt
                    ? new Date(consultation.scheduledAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {consultation.fees}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Concern:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {consultation.concern || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </span>
                <p
                  className={`font-semibold ${
                    consultation.status === "completed"
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {consultation.status || "pending"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetails;
