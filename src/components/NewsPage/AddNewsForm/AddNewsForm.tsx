import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TextInput from "../../Reusable/TextInput/TextInput";
import { X } from "lucide-react";
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
const [translateNews, { isLoading: isTranslating }] = useTranslateNewsMutation();

const {
  register,
  handleSubmit,
  setValue,
  reset,
  formState: { errors },
} = useForm<TFormValues>();

const [currentArticle, setCurrentArticle] = useState<{ content: string }>({ content: "" });
const [tags, setTags] = useState<string[]>([]);
const [tagInput, setTagInput] = useState("");
const [selectedLanguages, setSelectedLanguages] = useState<any[]>([]);
const [activeLanguage, setActiveLanguage] = useState<string | null>(null);

// ------------------------ TAG HANDLERS ------------------------
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setTagInput("");
  }
};

const removeTag = (tagToRemove: string) => {
  setTags(tags.filter((tag) => tag !== tagToRemove));
};

// ------------------------ CATEGORY FILTER ------------------------
const filteredCategory = categories?.data?.filter(
  (category: any) => category.areaName === "news"
);
const [allCategories, setAllCategories] = useState<string[]>(
  filteredCategory?.map((category: any) => category.category) || []
);

// ------------------------ LOAD DEFAULT / EDIT DATA ------------------------
// ------------------------ INITIALIZE DEFAULT LANGUAGE ------------------------
useEffect(() => {
  if (!defaultValues) return;

  // Set default language (first available or 'en')
  const defaultLang = Object.keys(defaultValues.translations || {})[0] || "en";
  setActiveLanguage(defaultLang);
  setSelectedLanguages([]);
}, [defaultValues]);

// ------------------------ LOAD TRANSLATION WHEN LANGUAGE CHANGES ------------------------
useEffect(() => {
  if (!defaultValues || !activeLanguage) return;

  const translation = defaultValues.translations?.[activeLanguage];

  if (translation) {
    // ✅ If translated category doesn't exist, add it to dropdown options
    if (
      translation.category &&
      !allCategories.includes(translation.category)
    ) {
      setAllCategories((prev) => [...prev, translation.category]);
    }

    loadTranslationToForm(translation);
  }
}, [activeLanguage, defaultValues, allCategories, setValue]);


const loadTranslationToForm = (translation: any) => {
  setValue("title", translation.title || "");
  setValue("category", translation.category || "");
  setCurrentArticle({ content: translation.content || "" });
  setTags(translation.tags || []);
};


// ------------------------ SUBMIT NEWS ------------------------
const handleSubmitNews = async (data: TFormValues) => {
  try {
    const formData = new FormData();

    if (data.file instanceof FileList && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    // Create translations payload
    const translationsPayload = {
      ...(defaultValues?.translations || {}),
      [activeLanguage || "en"]: {
        title: data.title,
        category: data.category,
        content: currentArticle.content,
        tags: tags,
      },
    };

    formData.append("translations", JSON.stringify(translationsPayload));

    let response;
    if (mode === "edit" && defaultValues?._id) {
      response = await updateNews({ id: defaultValues._id, data: formData }).unwrap();
      toast.success(response?.message || "News updated successfully");
    } else {
      response = await addNews(formData).unwrap();
      toast.success(response?.message || "News added successfully");
    }

    resetForm();
  } catch (error: any) {
    toast.error(error?.data?.message || "Something went wrong");
  }
};

const resetForm = () => {
  setShowForm(false);
  reset();
  setCurrentArticle({ content: "" });
  setTags([]);
};

// ------------------------ TRANSLATION ------------------------
const handleTranslateLanguage = async () => {
  try {
    console.log(defaultValues?.translations);
    const missingLanguages = selectedLanguages.filter(
      (lang) => !defaultValues?.translations?.[lang.code]
    );

    if (!missingLanguages.length) return alert("Select at least one new language.");

    const payload = {
      newsId: defaultValues?._id,
      title: defaultValues?.translations?.en?.title,
      content: defaultValues?.translations?.en?.content,
      tags: defaultValues?.translations?.en?.tags,
      category: defaultValues?.translations?.en?.category,
      batchLanguages: missingLanguages.map((lang) => ({ code: lang.code, name: lang.name })),
    };

    const res = await translateNews(payload).unwrap();

    if (res?.translations) {
      defaultValues.translations = { ...defaultValues.translations, ...res.translations };

      // Load first generated language
      const generatedLang = missingLanguages[0].code;
      setActiveLanguage(generatedLang);
      loadTranslationToForm(res.translations[generatedLang]);
    }
  } catch (error) {
    console.error("Translation failed:", error);
    alert("Failed to translate batch");
  }
};

// ------------------------ LANGUAGE HANDLERS ------------------------
const toggleLanguage = (language: any, checked: boolean) => {
  if (checked) setSelectedLanguages((prev) => [...prev, language]);
  else setSelectedLanguages((prev) => prev.filter((lang) => lang.code !== language.code));
};

const handleLanguageClick = (language: any) => {
  setActiveLanguage(language.code);

  const translation = defaultValues?.translations?.[language.code];
  if (translation) loadTranslationToForm(translation);
  else loadTranslationToForm({ title: "", category: "", content: "", tags: [] });
};


  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
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

          <div className="flex items-center w-full overflow-x-auto gap-4 mt-3">
            {LANGUAGES.map((language) => {
              const isChecked = selectedLanguages.some(
                (lang) => lang.code === language.code
              );

              return (
                <div key={language.code} className="flex items-center gap-2">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => toggleLanguage(language, e.target.checked)}
                    className="form-checkbox h-4 w-4 text-purple-500 rounded border-gray-300 focus:ring-purple-500"
                  />

                  {/* Button */}
                  <button
                    type="button"
                    onClick={() => handleLanguageClick(language)}
                    className={`flex items-center justify-center px-2 py-1 rounded shadow-sm text-xs font-medium whitespace-nowrap
            ${
              activeLanguage === language.code
                ? "bg-blue-600 text-white"
                : "bg-gray-400 text-white hover:bg-gray-700"
            }`}
                  >
                    {language.name}
                  </button>
                </div>
              );
            })}
          </div>
          {/* Generate by AI button */}
          <button
            type="button"
            onClick={handleTranslateLanguage}
            className="ml-auto flex items-center px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-medium shadow-sm"
          >
            {isTranslating ? "Translating..." : "Generate by AI"}
          </button>

          <form
            onSubmit={handleSubmit(handleSubmitNews)}
            className="space-y-6 mt-3"
          >
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

            {/* File upload */}
            <TextInput
              label="Image"
              type="file"
              {...register("file")}
              error={errors.file as any}
              isRequired={mode === "add"}
            />

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
