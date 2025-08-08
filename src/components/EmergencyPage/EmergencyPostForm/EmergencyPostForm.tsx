import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import toast from "react-hot-toast";
import Loader from "../../Shared/Loader/Loader";
import { useEffect, useState } from "react";
import {
  useGetSingleEmergencyQuery,
  useSendMessageToGroupsMutation,
} from "../../../redux/Features/Emergencies/emergencyApi";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useGetAllUsersQuery } from "../../../redux/Features/Auth/authApi";

const users = [
  {
    _id: "u1",
    name: "John Doe",
    country: "Bangladesh",
    district: "Dhaka",
    phone: "+880123456789",
  },
  {
    _id: "u2",
    name: "John Doe",
    country: "Bangladesh",
    district: "Dhaka",
    phone: "+880123456789",
  },
  {
    _id: "u3",
    name: "John Doe",
    country: "Bangladesh",
    district: "Dhaka",
    phone: "+880123456789",
  },
  {
    _id: "u4",
    name: "John Doe",
    country: "Bangladesh",
    district: "Dhaka",
    phone: "+880123456789",
  },
];

type TFormValues = {
  emergencyMessageId: string;
  title: string;
  location: string;
  userName: string;
  phoneNumber: string;
  status: string;
  adminMessage: string;
};

type TSendNotificationFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmergencyPostForm: React.FC<TSendNotificationFormProps> = ({
  showForm,
  setShowForm,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TFormValues>();

  const [emergencyId, setEmergencyId] = useState<string>("");

  const { data, isLoading: isSingleEmergencyLoading } =
    useGetSingleEmergencyQuery(emergencyId);

  const [sendMessageToGroups, { isLoading }] = useSendMessageToGroupsMutation();
  const [targetedAudience, setTargetedAudience] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      reset({
        emergencyMessageId: data?.data?._id || "",
        title: data?.data?.message || "",
        location: data?.data?.location || "",
        userName: data?.data?.user?.name || "",
        phoneNumber: data?.data?.user?.phoneNumber || "",
        status: data?.data?.status || "",
      });
    }
  }, [data, reset]);

  const handleSendNotification = async (data: TFormValues) => {
    if (targetedAudience.length === 0) {
      toast.error("Please select at least one targeted audience");
      return;
    }

    try {
      const payload = {
        ...data,
        targetedAudience,
      };
      const response = await sendMessageToGroups(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Message forwarded successfully");
        setShowForm(false);
      }
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

  const bangladeshDistricts = [
    "Bagerhat",
    "Bandarban",
    "Barguna",
    "Barishal",
    "Bhola",
    "Bogra",
    "Brahmanbaria",
    "Chandpur",
    "Chapai Nawabganj",
    "Chattogram",
    "Chuadanga",
    "Cox's Bazar",
    "Cumilla",
    "Dhaka",
    "Dinajpur",
    "Faridpur",
    "Feni",
    "Gaibandha",
    "Gazipur",
    "Gopalganj",
    "Habiganj",
    "Jamalpur",
    "Jashore",
    "Jhalokati",
    "Jhenaidah",
    "Joypurhat",
    "Khagrachari",
    "Khulna",
    "Kishoreganj",
    "Kurigram",
    "Kushtia",
    "Lakshmipur",
    "Lalmonirhat",
    "Madaripur",
    "Magura",
    "Manikganj",
    "Meherpur",
    "Moulvibazar",
    "Munshiganj",
    "Mymensingh",
    "Naogaon",
    "Narail",
    "Narayanganj",
    "Narsingdi",
    "Natore",
    "Netrokona",
    "Nilphamari",
    "Noakhali",
    "Pabna",
    "Panchagarh",
    "Patuakhali",
    "Pirojpur",
    "Rajbari",
    "Rajshahi",
    "Rangamati",
    "Rangpur",
    "Satkhira",
    "Shariatpur",
    "Sherpur",
    "Sirajganj",
    "Sunamganj",
    "Sylhet",
    "Tangail",
    "Thakurgaon",
  ];

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCountry(value);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDistrict(value);
  };

  const { data:allUsers, isLoading:isUserLoading, isFetching } = useGetAllUsersQuery({});

  const filteredUsers = allUsers?.data?.filter(
    (user:any) =>
      user?.country === selectedCountry && user?.city === selectedDistrict
  );

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const isAllSelected = selectedUserIds.length === filteredUsers.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      const allIds = filteredUsers.map((user) => user._id);
      setSelectedUserIds(allIds);
    }
  };

  const toggleSelectUser = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds((prev) => prev.filter((_id) => _id !== id));
    } else {
      setSelectedUserIds((prev) => [...prev, id]);
    }
  };

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[600px] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleSendNotification)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Send New Notification
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <TextInput
                label="Emergency Message Id"
                placeholder="Enter Emergency Message Id"
                {...register("emergencyMessageId", {
                  required: "Emergency Message Id is required",
                })}
                error={errors.title}
                onChange={(e) => setEmergencyId(e.target.value)}
              />
              {isSingleEmergencyLoading && (
                <p className="text-sm text-blue-500">
                  Loading emergency data...
                </p>
              )}
              {/* Step 3: Show rest of the inputs when data is loaded */}
              {data?.data && emergencyId && (
                <>
                  <TextInput
                    label="Title"
                    placeholder="Emergency Title"
                    {...register("title")}
                    isDisabled={true}
                    error={errors.title}
                  />
                  <TextInput
                    label="User Name"
                    placeholder="User name"
                    {...register("userName")}
                    isDisabled={true}
                    error={errors.userName}
                  />
                  <TextInput
                    label="Location"
                    placeholder="User location"
                    {...register("location")}
                    isDisabled={true}
                    error={errors.location}
                  />
                  <TextInput
                    label="Phone Number"
                    placeholder="User phone number"
                    {...register("phoneNumber")}
                    isDisabled={true}
                    error={errors.phoneNumber}
                  />
                  <TextInput
                    label="Status"
                    placeholder="Status"
                    {...register("status")}
                    isDisabled={true}
                    error={errors.status}
                  />

                  <Textarea
                    label="Admin Message"
                    placeholder="Write admin message"
                    {...register("adminMessage")}
                    error={errors.adminMessage}
                  />
                </>
              )}

              <SelectDropdown
                label="Country"
                value={selectedCountry}
                onChange={handleCountryChange}
                options={["Bangladesh"]}
              />

              <SelectDropdown
                label="District"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                options={
                  selectedCountry === "Bangladesh" ? bangladeshDistricts : []
                }
                placeholder={
                  selectedCountry ? "Select district" : "Select country first"
                }
                disabled={!selectedCountry}
              />

              <div>
                <p className="font-medium text-gray-700 dark:text-white mb-2">
                  Targeted Audience <span className="text-red-600"> *</span>
                </p>

                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                          User ID
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                          Location
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                          Phone Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900">
                      {isUserLoading ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center">
                            <Loader size="size-10" />
                          </td>
                        </tr>
                      ) : filteredUsers?.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-6 text-center text-gray-500 dark:text-gray-300"
                          >
                            No user found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers?.map((user) => (
                          <tr
                            key={user._id}
                            className="border-b border-gray-300 dark:border-gray-700"
                          >
                            <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                checked={selectedUserIds.includes(user._id)}
                                onChange={() => toggleSelectUser(user._id)}
                              />
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                              {user._id}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                              {user.name}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                              {user.district}, {user.country}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                              {user.phone}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? <Loader size="size-4" /> : "Forward Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EmergencyPostForm;
