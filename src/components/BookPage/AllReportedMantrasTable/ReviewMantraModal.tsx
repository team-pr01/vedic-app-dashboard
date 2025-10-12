import React, { useEffect, useState } from "react";
import {
  useGetSingleReportedMantraQuery,
  useUpdateStatusMutation,
} from "../../../redux/Features/Book/reportedMantraApi";
import Loader from "../../Shared/Loader/Loader";
import toast from "react-hot-toast";

interface ReviewMantraModalProps {
  selectedMantraId: string;
  setIsReviewMantraModalOpen: (open: boolean) => void;
}

const ReviewMantraModal: React.FC<ReviewMantraModalProps> = ({
  selectedMantraId,
  setIsReviewMantraModalOpen,
}) => {
  const [isHumanVerified , setIsHumanVerified] = useState<boolean>(false);
  const {
    data: reportedMantra,
    isLoading,
    isFetching,
  } = useGetSingleReportedMantraQuery(selectedMantraId);
  const [updateStatus, { isLoading: isUpdateStatus }] = useUpdateStatusMutation();

  const data = reportedMantra?.data;

  useEffect(() => {
    setIsHumanVerified(data?.isHumanVerified);
  }, [])

  const handleDismissReport = async () => {
    try {
      const payload = {
        status: "dismissed",
      };
      const response = await updateStatus({
        id: selectedMantraId,
        data: payload,
      }).unwrap();

      if (response?.success) {
        toast.success("Report dismissed successfully");
        setIsReviewMantraModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAsHumanVerified = async () => {
    try {
      const payload = {
        isHumanVerified,
      };
      const response = await updateStatus({
        id: selectedMantraId,
        data: payload,
      }).unwrap();

      if (response?.success) {
        toast.success("Status updated successfully");
        setIsReviewMantraModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Loader (centered) */}
        {(isLoading || isFetching) && (
          <div className="py-20">
            <Loader size="size-12" />
          </div>
        )}

        {/* Render only when data is available */}
        {!isLoading && !isFetching && data && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Review Mantra Report
              </h2>
              <button
                onClick={() => setIsReviewMantraModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Left - Report Details */}
              <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-3">
                  Report Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500">Reason</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100">
                      {data.reason}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Feedback</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 italic">
                      “{data.feedback}”
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Reported On</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100">
                      {data.createdAt}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mantra (view only) */}
              <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-3">
                  Mantra
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500">Original Text</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 whitespace-pre-line">
                      {data.originalText}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Translation</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 whitespace-pre-line">
                      {data.translation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 dark:border-slate-700">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isHumanVerified}
                  onChange={(e) => setIsHumanVerified(e.target.checked)}
                />
                Mark as Human Verified
              </label>

              <div className="flex gap-3">
                <button
                  onClick={handleDismissReport}
                  type="button"
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500"
                >
                  {isUpdateStatus ? "Please wait..." : "Dismiss Report"}
                </button>
                <button
                  type="button"
                  onClick={handleMarkAsHumanVerified}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                >
                  {
                    isUpdateStatus ? "Please wait..." : "Save & Resolve"
                  }
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewMantraModal;
