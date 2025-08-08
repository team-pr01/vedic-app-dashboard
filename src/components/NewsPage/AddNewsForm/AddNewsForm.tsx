import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import { X } from "lucide-react";
import {
  useAddNewsMutation,
  useUpdateNewsMutation,
} from "../../../redux/Features/News/newsApi";
import toast from "react-hot-toast";
import Loader from "../../Shared/Loader/Loader";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Categories/ReelCategory/categoriesApi";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";

type TFormValues = {
  title: string;
  content: string;
  tags: string[];
  excerpt: string;
  category: string;
  file?: any;
};

type TAddNewsFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "add" | "edit";
  defaultValues?: any;
};

const AddNewsForm: React.FC<TAddNewsFormProps> = ({
  showForm,
  setShowForm,
  mode,
  defaultValues,
}) => {
  const { data: categories } = useGetAllCategoriesQuery({});
  const [addNews, { isLoading: isAdding }] = useAddNewsMutation();
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const [currentArticle, setCurrentArticle] = useState<{ content: string }>({
    content: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        const newTags = [...tags, trimmed];
        setTags(newTags);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const filtered = tags.filter((tag) => tag !== tagToRemove);
    setTags(filtered);
  };

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      setValue("title", defaultValues?.title);
      setValue("excerpt", defaultValues?.excerpt);
      setValue("category", defaultValues?.category);
      setCurrentArticle({ content: defaultValues?.content || "" });
      setTags(defaultValues?.tags || []);
    }
  }, [defaultValues, mode, setValue]);

  //   Function to add or edit vastu
  const handleSubmitNews = async (data: TFormValues) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "file" && value instanceof FileList && value.length > 0) {
          formData.append("file", value[0]);
        } else {
          formData.append(key, value as string);
        }
      });

      // Append tags (as array)
      tags.forEach((tag: string, index: number) => {
        formData.append(`tags[${index}]`, tag);
      });

      // Append content
      formData.append("content", currentArticle.content);

      let response;
      if (mode === "edit" && defaultValues?._id) {
        response = await updateNews({
          id: defaultValues._id,
          data: formData,
        }).unwrap();
        if (response?.success) {
          toast.success(response?.message || "News updated successfully");
        }
      } else {
        response = await addNews(formData).unwrap();
        if (response?.success) {
          toast.success(response?.message || "News added successfully");
        }
      }

      setShowForm(false);
      reset();
      setCurrentArticle({ content: "" }); // ✅ clear after submit
      setTags([]);
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

  const filteredCategory = categories?.data?.filter(
    (category: any) => category.areaName === "news"
  );

  const allCategories = filteredCategory?.map(
    (category: any) => category.category
  );

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleSubmitNews)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Article
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

            <TextInput
              label="Title"
              placeholder="Enter Title"
              {...register("title", {
                required: "Title is required",
              })}
              error={errors.title}
            />

            <SelectDropdown
              label="Category"
              {...register("category")}
              error={errors?.category}
              options={allCategories}
            />

            {/* File upload */}
            <TextInput
              label="Image"
              type="file"
              {...register("file")}
              error={errors.file as any}
              isRequired={mode === "add"}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content
              </label>
              <div className="mt-1">
                <ReactQuill
                  value={currentArticle.content}
                  onChange={(content) =>
                    setCurrentArticle({ ...currentArticle, content })
                  }
                  className="bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            <Textarea
              label="Excerpt"
              placeholder="Write Excerpt here..."
              rows={6}
              error={errors.excerpt}
              {...register("excerpt", {
                required: "Excerpt is required",
              })}
            />

            <div>
              <TextInput
                label="Tags"
                name="tags"
                placeholder="Enter tag. Press enter to add another tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                error={
                  Array.isArray(errors.tags) ? errors.tags[0] : errors.tags
                }
                isRequired={false}
              />
              {/* Display tags below the input */}
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
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
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isAdding || isUpdating ? <Loader size="size-4" /> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddNewsForm;
