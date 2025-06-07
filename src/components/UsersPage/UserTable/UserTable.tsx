import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import UpdateUserModal from "../UpdateUserModal/UpdateUserModal";
import {
  useGetAllUsersQuery,
  useGetSingleUserByIdQuery,
} from "../../../redux/Features/Auth/authApi";
import Loader from "../../Shared/Loader/Loader";

const UserTable = () => {
  const [id, setId] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllUsersQuery({});

  const { data: singleUserData, isLoading: isUserDataLoading } = useGetSingleUserByIdQuery(id);

  const [showForm, setShowForm] = useState<boolean>(false);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-200 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Phone Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Joined
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Assigned Pages
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        {isLoading || isFetching ? (
          <tbody>
            <tr>
              <td colSpan={6}>
                <div className="flex justify-center items-center py-10">
                  <Loader size="size-10" />
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data?.data?.map((user: any) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {user.phoneNumber}
                  </span>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() =>
                    handleUpdateStatus()
                  }
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === "active"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  }`}
                >
                  {user.status}
                </button>
              </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {user?.assignedPages?.length > 0
                    ? user?.assignedPages?.join(", ")
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setId(user?._id);
                        setShowForm(true);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      // onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <UpdateUserModal
        showForm={showForm}
        setShowForm={setShowForm}
        defaultValues={singleUserData?.data}
        isLoading={isUserDataLoading}
      />
    </div>
  );
};

export default UserTable;
