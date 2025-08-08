import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import {
  useAssignPagesMutation,
  useChangeUserRoleMutation,
} from "../../../redux/Features/Auth/authApi";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import Loader from "../../Shared/Loader/Loader";

type TFormValues = {
  role: string;
  assignedPages: string[];
};

type TUpdateUserModalProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues?: any;
  isLoading?: boolean;
};

const UpdateUserModal: React.FC<TUpdateUserModalProps> = ({
  showForm,
  setShowForm,
  defaultValues,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const [changeUserRole, { isLoading: isUserRoleUpdating }] =
    useChangeUserRoleMutation();
  const [assignPages, { isLoading: isAssigningPage }] =
    useAssignPagesMutation();

  const [assignedPages, setAssignedPages] = useState<string[]>([]);

  // Fetching default values
  useEffect(() => {
    setValue("role", defaultValues?.role);
    setAssignedPages(defaultValues?.assignedPages || []);
  }, [defaultValues, setValue]);

  //   Function to change user role
  const handleChangeUserRole = async (data: TFormValues) => {
    try {
      const payload = {
        userId: defaultValues?._id,
        role: data.role,
      };
      const response = await changeUserRole(payload).unwrap();
      console.log(response);
      setShowForm(false);
      reset();
    } catch (error) {
      const errMsg =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as any).data?.message === "string"
          ? (error as any).data.message
          : "Something went wrong";
      toast.error(errMsg);
    }
  };

  //   Function to change assigned pages
  const handleChangeAssignedPages = async () => {
    try {
      const payload = {
        userId: defaultValues?._id,
        pages: assignedPages,
      };
      const response = await assignPages(payload).unwrap();
      if (response?.success)
        toast.success(response?.message || "Pages updated successfully");
      setShowForm(false);
      reset();
    } catch (error) {
      const errMsg =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as any).data?.message === "string"
          ? (error as any).data.message
          : "Something went wrong";
      toast.error(errMsg);
    }
  };

  const removePage = (pageToRemove: string) => {
    const filtered = assignedPages.filter((page) => page !== pageToRemove);
    setAssignedPages(filtered);
  };

  const pages = [
    { name: "Dashboard", value: "/dashboard" },
    { name: "Emergency", value: "/dashboard/emergency" },
    { name: "Users", value: "/dashboard/users" },
    { name: "Religious Texts", value: "/dashboard/religious-texts" },
    { name: "Reels", value: "/dashboard/reels" },
    { name: "Yoga", value: "/dashboard/yoga" },
    { name: "Vastu", value: "/dashboard/vastu" },
    { name: "Temple Management", value: "/dashboard/temple-management" },
    { name: "Organization", value: "/dashboard/organizations" },
    { name: "News", value: "/dashboard/news" },
    { name: "Notifications", value: "/dashboard/notifications" },
    { name: "Popups", value: "/dashboard/popups" },
    { name: "Consultancy Service", value: "/dashboard/consultancy" },
    { name: "Content Management", value: "/dashboard/content" },
    { name: "API Keys", value: "/dashboard/api-keys" },
    { name: "Analytics", value: "/dashboard/analytics" },
    { name: "Activity", value: "/dashboard/activity" },
    { name: "Settings", value: "/dashboard/settings" },
    { name: "Help", value: "/dashboard/help" },
  ];

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto">
          {isLoading ? (
            <Loader size="size-10" />
          ) : (
            <div>
              <form
                onSubmit={handleSubmit(handleChangeUserRole)}
                className="p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Change Role and Assigned Pages
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      reset();
                    }}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <SelectDropdown
                  label="User Role"
                  {...register("role")}
                  error={errors?.role}
                  options={["user", "admin", "moderator", "super-admin"]}
                />

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <SubmitButton isLoading={isLoading || isUserRoleUpdating} />
                </div>
              </form>
              <form
                onSubmit={handleSubmit(handleChangeAssignedPages)}
                className="p-6 space-y-6"
              >
                <div className="flex flex-col">
                  <label className="text-neutral-65">Assigned Pages</label>

                  {/* Display assigned pages below the input */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {assignedPages.map((page, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        <span>{page}</span>
                        <button
                          type="button"
                          onClick={() => removePage(page)}
                          className="ml-1 text-blue-500 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="text-neutral-65 mt-5">All Pages</label>
                  {/* All pages */}
                  <div className="flex flex-wrap items-center gap-3 w-full mt-3">
                    {pages?.map((page) => (
                      <div
                        key={page?.name}
                        onClick={() => {
                          if (!assignedPages.includes(page.value)) {
                            setAssignedPages((prev) => [...prev, page.value]);
                          }
                        }}
                        className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium cursor-pointer transition ${
                          assignedPages.includes(page.value)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600"
                        }`}
                      >
                        {page?.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <SubmitButton isLoading={isAssigningPage} />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default UpdateUserModal;
