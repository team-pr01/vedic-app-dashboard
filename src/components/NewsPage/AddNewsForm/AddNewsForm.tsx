import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TextInput from "../../Reusable/TextInput/TextInput";
import { Cpu, X } from "lucide-react";
import {
  useAddNewsMutation,
  useTranslateNewsMutation,
  useUpdateNewsMutation,
} from "../../../redux/Features/News/newsApi";
import toast from "react-hot-toast";
import Loader from "../../Shared/Loader/Loader";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Categories/ReelCategory/categoriesApi";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { LANGUAGES } from "../../../lib/allLanguages";

type TFormValues = {
  title: string;
  content: string;
  tags: string[];
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
      setCurrentArticle({ content: "" });
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

  const languageBatches = [];
  for (let i = 0; i < LANGUAGES.length; i += 10) {
    languageBatches.push(LANGUAGES.slice(i, i + 10));
  }

  const [translateNews] = useTranslateNewsMutation();
  const [loadingBatch, setLoadingBatch] = useState<number | null>(null);
  const newsId = defaultValues?._id;

  const handleTranslateBatch = async (batch: any, idx: number) => {
    setLoadingBatch(idx);
    try {
      const payload = {
        newsId,
        title: defaultValues?.title,
        content: defaultValues?.content,
        tags: defaultValues?.tags,
        category: defaultValues?.category,
        batchLanguages: batch,
      };
      await translateNews(payload).unwrap();
    } catch (error) {
      console.error("Failed to translate batch:", error);
      alert(`Failed to translate batch ${idx + 1}`);
    } finally {
      setLoadingBatch(null);
    }
  };

  const existingTranslations: string[] = Object.keys(
    defaultValues.translations || {}
  );

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto flex gap-3 p-6">
          <form
            onSubmit={handleSubmit(handleSubmitNews)}
            className="space-y-6 w-[50%] border-r border-gray-300 pr-3"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Article
            </h3>

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

          <div className="w-[50%] h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Translate with AI
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

            <div className="flex flex-wrap gap-2 mt-3">
              {languageBatches.map((batch, idx) => {
                // Check if ALL languages in this batch exist in existingTranslations
                const isBatchCompleted = batch.every((langCode) =>
                  existingTranslations.includes(langCode.code)
                );

                return (
                  <button
                    key={idx}
                    type="button"
                    className="flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => handleTranslateBatch(batch, idx)}
                    disabled={isBatchCompleted || loadingBatch === idx}
                  >
                    {loadingBatch === idx ? (
                      <Loader size="size-4" />
                    ) : (
                      <>
                        <Cpu className="w-4 h-4 text-yellow-300" />
                        <span>
                          {isBatchCompleted
                            ? `Batch ${idx + 1} Completed`
                            : `Translate Batch ${idx + 1}`}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Show translations if available */}
            {defaultValues?.translations &&
              Object.keys(defaultValues.translations).length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(defaultValues.translations).map(
                    ([langCode, data]: [string, any], idx: number) => (
                      <div
                        key={idx}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800"
                      >
                        {/* Language Label */}
                        <div className="mb-2">
                          <span className="px-2 py-1 text-xs font-medium text-white bg-purple-600 rounded">
                            {langCode.toUpperCase()} -{" "}
                            {LANGUAGES.find((l) => l.code === langCode)?.name ||
                              ""}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {data.title || "No Title"}
                        </h4>

                        {/* Content */}
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {data.content || "No Content"}
                        </p>

                        {/* Tags */}
                        {data.tags?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {data.tags.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    )
  );
};

export default AddNewsForm;
