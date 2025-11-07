import { useState } from "react";
import {
  useGetAllSubscriptionsQuery,
  useMarkUserAsSubscribedMutation,
  useMarkUserAsUnSubscribedMutation,
} from "../../redux/Features/Subscription/subscriptionApi";
import { Loader, Search, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

const Subscriptions = () => {
  const [keyword, setKeyword] = useState("");
  const { data, isLoading, isFetching } = useGetAllSubscriptionsQuery({
    keyword,
  });
  const [markUserAsSubscribed, { isLoading: isMarkingUserPaid }] =
    useMarkUserAsSubscribedMutation();
  const [markUserAsUnSubscribed, { isLoading: isMarkingUserUnPaid }] =
    useMarkUserAsUnSubscribedMutation();

  const handleMarkUserAsSubscribed = async (data: any) => {
    try {
      const payload = {
        userId: data?.userId?._id,
        subscriptionId: data?._id,
        subscriptionPlanName: data?.subscriptionPlanName,
      };
      const response = await markUserAsSubscribed(payload).unwrap();
      if (response?.success) {
        toast.success("User marked as subscribed.");
      }
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };

  const handleMarkUserAsUnSubscribed = async (data: any) => {
    try {
      const payload = {
        userId: data?.userId?._id,
        subscriptionId: data?._id,
      };
      const response = await markUserAsUnSubscribed(payload).unwrap();
      if (response?.success) {
        toast.success("User marked as un-subscribed.");
      }
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <UserCheck className="h-6 w-6 mr-2" />
          Subscriptions
        </h2>
        <div className="flex-1 max-w-[400px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search subscriptions...`}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary-500 transition duration-300"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-w-[1800px] mt-5">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-900">
            <tr>
              {[
                "User",
                "Subscription Plan",
                "Amount",
                "Payment Method",
                "Sender Account Number",
                "Start Date",
                "End Date",
                "Status",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {isLoading || isFetching ? (
            <tbody>
              <tr>
                <td colSpan={9}>
                  <div className="flex justify-center items-center py-10">
                    <Loader className="h-10 w-10 animate-spin" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 max-w-[1000px]">
              {data?.data?.length > 0 ? (
                data.data.map((subscription: any) => (
                  <tr key={subscription._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <p>{subscription.userId?.name || "N/A"}</p>
                      {subscription.userId?.phoneNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {subscription.subscriptionPlanName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ${subscription.amount || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {subscription.paymentMethod || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {subscription.senderAccountNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {subscription.createdAt
                        ? new Date(subscription.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {subscription.endDate
                        ? new Date(subscription.endDate).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {subscription?.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button
                        className={`px-3 py-1 text-sm font-medium rounded-md bg-green-50 text-green-500 disabled:cursor-not-allowed`}
                        onClick={() => handleMarkUserAsSubscribed(subscription)}
                        disabled={isMarkingUserPaid}
                      >
                        {isMarkingUserPaid
                          ? "Loading..."
                          : "Mark as Subscribed"}
                      </button>
                      <button
                        className={`px-3 py-1 text-sm font-medium rounded-md bg-red-50 text-red-500 disabled:cursor-not-allowed`}
                        onClick={() =>
                          handleMarkUserAsUnSubscribed(subscription)
                        }
                        disabled={isMarkingUserUnPaid}
                      >
                        {isMarkingUserUnPaid
                          ? "Loading..."
                          : "Mark as Un-Subscribed"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Subscriptions;
