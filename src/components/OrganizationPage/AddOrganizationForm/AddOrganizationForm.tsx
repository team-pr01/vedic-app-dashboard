import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import Textarea from "../../Reusable/TextArea/TextArea";
export type TFormValues = {
  name: string;
  type: "gurukul" | "vedic_institution" | "ashram";
  description: string;
  headTeacher: string;
  studentCapacity: number;
  coursesOffered: string;

  contact: {
    email: string;
    phone: string;
    website?: string;
  };

  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};
const AddOrganizationForm = ({setShowForm} : {setShowForm: React.Dispatch<React.SetStateAction<boolean>>}) => {
     const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<TFormValues>();

    const handleAddOrganization = async (data: TFormValues) => {
    console.log(data);
  };
    return (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto">
            <form
              onSubmit={handleSubmit(handleAddOrganization)}
              className="p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Organization
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Name"
                  placeholder="Enter organization name"
                  {...register("name", { required: "Name is required" })}
                  error={errors.name}
                />

                <SelectDropdown
                  label="Type"
                  {...register("type")}
                  error={errors?.type}
                  options={["gurukul", "vedic_institution", "ashram"]}
                />

                <Textarea
                  label="Description"
                  placeholder="Write description here..."
                  rows={6}
                  error={errors.description}
                  {...register("description", {
                    required: "Description is required",
                  })}
                />

                <TextInput
                  label="Head Teacher"
                  placeholder="Enter head teacher name"
                  {...register("headTeacher", {
                    required: "Head Teacher is required",
                  })}
                  error={errors.headTeacher}
                />

                <TextInput
                  label="Student Capacity"
                  type="number"
                  placeholder="Enter student capacity"
                  {...register("studentCapacity", {
                    required: "Student Capacity is required",
                    valueAsNumber: true,
                  })}
                  error={errors.studentCapacity}
                />

                <TextInput
                  label="Courses Offered (comma-separated)"
                  placeholder="Vedic Mathematics, Sanskrit, Yoga..."
                  {...register("coursesOffered", {
                    required: "Courses Offered is required",
                  })}
                  error={errors.coursesOffered}
                />

                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextInput
                      label="Email"
                      type="email"
                      placeholder="Email"
                      {...register("contact.email", {
                        required: "Email is required",
                      })}
                      error={errors.contact?.email}
                    />

                    <TextInput
                      label="Phone"
                      type="tel"
                      placeholder="Phone"
                      {...register("contact.phone", {
                        required: "Phone is required",
                      })}
                      error={errors.contact?.phone}
                    />

                    <TextInput
                      label="Website"
                      type="url"
                      placeholder="Website"
                      {...register("contact.website")}
                      error={errors.contact?.website}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <TextInput
                        label="Street Address"
                        type="text"
                        placeholder="Street Address"
                        {...register("address.street", {
                          required: "Street address is required",
                        })}
                        error={errors.address?.street}
                      />
                    </div>

                    <TextInput
                      label="City"
                      type="text"
                      placeholder="City"
                      {...register("address.city", {
                        required: "City is required",
                      })}
                      error={errors.address?.city}
                    />

                    <TextInput
                      label="State"
                      type="text"
                      placeholder="State"
                      {...register("address.state", {
                        required: "State is required",
                      })}
                      error={errors.address?.state}
                    />

                    <TextInput
                      label="Postal Code"
                      type="text"
                      placeholder="Postal Code"
                      {...register("address.postalCode", {
                        required: "Postal code is required",
                      })}
                      error={errors.address?.postalCode}
                    />

                    <TextInput
                      label="Country"
                      type="text"
                      placeholder="Country"
                      {...register("address.country", {
                        required: "Country is required",
                      })}
                      error={errors.address?.country}
                    />
                  </div>
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
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
    );
};

export default AddOrganizationForm;