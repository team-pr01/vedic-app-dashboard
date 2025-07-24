import { useForm } from "react-hook-form";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import TextInput from "../../Reusable/TextInput/TextInput";
import toast from "react-hot-toast";
import {
  useAddReelCategoryMutation,
  useDeleteReelCategoryMutation,
  useGetAllReelCategoriesQuery,
} from "../../../redux/Features/Categories/ReelCategory/reelCategory";
import { Trash } from "lucide-react";
import { useState } from "react";

type TFormValues = {
  category: string;
};
const ReelCategories = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const [isAddCategoryFormVisible, setIsAddCategoryFormVisible] =
    useState(false);

  const { data: categories } = useGetAllReelCategoriesQuery({});
  const [addReelCategory, { isLoading: isAdding }] =
    useAddReelCategoryMutation();

  const handleAddReelCategory = async (data: TFormValues) => {
    try {
      const payload = {
        category: data.category,
      };

      const response = await addReelCategory(payload).unwrap();
      if (response?.success) {
        toast.success("Category added successfully");
      }
      setIsAddCategoryFormVisible(false);
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

  const [deleteReelCategory] = useDeleteReelCategoryMutation();
  const handleDeleteReelCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    toast.promise(deleteReelCategory(id).unwrap(), {
      loading: "Deleting book...",
      success: "Book deleted successfully!",
      error: "Failed to delete book.",
    });
  };
  return (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Manage Reel Categories
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                reset();
              }}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex items-center justify-between mt-5">
            <h3 className=" font-semibold text-gray-900 dark:text-white">
              All Categories
            </h3>
            <button
              onClick={() => setIsAddCategoryFormVisible(true)}
              className="font-semibold text-blue-600"
            >
              +Add New
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            {categories?.data?.map((category: any) => (
              <div
                key={category?._id}
                className="bg-white border border-gray-300 rounded-xl p-3 font-semibold text-neutral-800 flex items-center gap-2 justify-between"
              >
                <span>{category?.category}</span>
                <button
                  onClick={() => handleDeleteReelCategory(category?._id)}
                  className="text-red-500"
                >
                  <Trash className="size-5" />
                </button>
              </div>
            ))}
          </div>
          {isAddCategoryFormVisible && (
            <form
              onSubmit={handleSubmit(handleAddReelCategory)}
              className="space-y-6 mt-10"
            >
              <TextInput
                label="Category Name"
                placeholder="Enter Category Name"
                {...register("category", {
                  required: "Category name is required",
                })}
                error={errors.category}
              />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <SubmitButton isLoading={isAdding} />
              </div>
            </form>
          )}
        </div>
      </div>
    )
  );
};

export default ReelCategories;
