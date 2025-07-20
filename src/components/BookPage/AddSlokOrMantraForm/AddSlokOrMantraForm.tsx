import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import toast from "react-hot-toast";
import { useAddSlokOrMantraMutation } from "../../../redux/Features/Book/bookApi";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import Textarea from "../../Reusable/TextArea/TextArea";
import { useState } from "react";

// Language codes
const languageOptions = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Bangla", value: "bn" },
];

type TFormValues = {
  type: string;
  number: number;
  originalText: string;
};

type TTranslationField = {
  langCode: string;
  text: string;
};

const AddSlokOrMantraForm = ({
  showForm,
  setShowForm,
  bookId,
  selectedChapters,
}: {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  bookId: string;
  selectedChapters: any[];
}) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<
    number | null
  >(null);
  const [translations, setTranslations] = useState<TTranslationField[]>([
    { langCode: "en", text: "" },
  ]);

  const handleAddTranslation = () => {
    setTranslations([...translations, { langCode: "", text: "" }]);
  };

  const handleRemoveTranslation = (index: number) => {
    if (translations.length === 1) return;
    const updated = [...translations];
    updated.splice(index, 1);
    setTranslations(updated);
  };

  const handleTranslationChange = (
    index: number,
    key: "langCode" | "text",
    value: string
  ) => {
    const updated = [...translations];
    updated[index][key] = value;
    setTranslations(updated);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const [addSlokOrMantra, { isLoading }] = useAddSlokOrMantraMutation();

  const handleAddSlokOrMantra = async (data: TFormValues) => {
    try {
      const translationObject = translations.reduce((acc, curr) => {
        if (curr.langCode && curr.text) {
          acc[curr.langCode] = curr.text;
        }
        return acc;
      }, {} as Record<string, string>);

      const payload = {
        ...data,
        translations: translationObject,
      };

      console.log(payload);

      const response = await addSlokOrMantra({ data:payload, id: bookId, chapterIndex: selectedChapterIndex }).unwrap();

      if (response?.success) {
        toast.success("Added successfully");
        setShowForm(false);
        reset();
        setTranslations([{ langCode: "en", text: "" }]);
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

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Chapter
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

          {
            selectedChapterIndex === null &&
            <div className="flex flex-col gap-4 mt-5">
            {selectedChapters.length > 0 ? (
              selectedChapters?.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedChapterIndex(index)}
                  className="bg-neutral-200 hover:bg-neutral-100 p-3 rounded-md cursor-pointer text-start"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {chapter?.chapterTitle}
                  </h3>
                </button>
              ))
            ) : (
              <p className="text-red-500">No chapters available</p>
            )}
          </div>
          }

          {selectedChapterIndex !== null && (
            <form
              onSubmit={handleSubmit(handleAddSlokOrMantra)}
              className="flex flex-col gap-5 mt-5"
            >
              <SelectDropdown
                label="Type"
                {...register("type")}
                error={errors?.type}
                options={["slok", "mantra"]}
              />

              <TextInput
                label="Number"
                placeholder="Enter Number"
                {...register("number", { required: "Number is required" })}
                error={errors.number}
              />

              <Textarea
                label="Original Text"
                placeholder="Write Original Text here..."
                rows={6}
                error={errors.originalText}
                {...register("originalText")}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Translations
                </label>
                {translations.map((field, index) => (
                  <div key={index} className="space-y-2 mb-4">
                    <div className="flex items-center gap-3">
                      <select
                        value={field.langCode}
                        onChange={(e) =>
                          handleTranslationChange(
                            index,
                            "langCode",
                            e.target.value
                          )
                        }
                        className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select Language</option>
                        {languageOptions.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>

                      {translations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTranslation(index)}
                          className="text-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <textarea
                      value={field.text}
                      onChange={(e) =>
                        handleTranslationChange(index, "text", e.target.value)
                      }
                      placeholder="Enter translation"
                      rows={4}
                      className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddTranslation}
                  className="text-sm text-blue-600 underline"
                >
                  + Add Another Translation
                </button>
              </div>

              <div className="flex justify-end space-x-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <SubmitButton isLoading={isLoading} />
              </div>
            </form>
          )}
        </div>
      </div>
    )
  );
};

export default AddSlokOrMantraForm;
