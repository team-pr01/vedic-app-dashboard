import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useEffect, useState } from "react";
import Textarea from "../../Reusable/TextArea/TextArea";
import { useUpdateBookMutation } from "../../../redux/Features/Book/bookApi";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import toast from "react-hot-toast";
import EditChapters from "./EditChapters";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";

type TEditBookModalProps = {
  book: any;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
};

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Bangla", value: "bn" },
];

const EditBookModal: React.FC<TEditBookModalProps> = ({
  book,
  showForm,
  setShowForm,
  isLoading,
}) => {
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const [chapterData, setChapterData] = useState<
    {
      chapterTitle: string;
      order: number;
      type: string[];
      slokOrMantras: {
        type: string;
        number: number;
        originalText: string;
        translations: { [langCode: string]: string };
      }[];
    }[]
  >([]);

  useEffect(() => {
    if (book?.data) {
      setValue("title", book.data.title);
      setValue("description", book.data.description);
      setChapterData(
        book.data.chapters.map((ch: any) => ({
          chapterTitle: ch.chapterTitle || "",
          order: ch.order || 0,
          type: ch.type || [""],
          slokOrMantras: ch.slokOrMantras || [],
        }))
      );
    }
  }, [book, setValue]);

  // Chapter type handlers
  const handleAddType = (chapterIndex: number) => {
    setChapterData((prev) =>
      prev.map((chapter, idx) =>
        idx === chapterIndex
          ? { ...chapter, type: [...chapter.type, ""] }
          : chapter
      )
    );
  };

  const handleRemoveType = (chapterIndex: number, typeIndex: number) => {
    setChapterData((prev) =>
      prev.map((chapter, cIdx) =>
        cIdx === chapterIndex
          ? {
              ...chapter,
              type: chapter.type.filter((_, tIdx) => tIdx !== typeIndex),
            }
          : chapter
      )
    );
  };

  const handleTypeChange = (
    chapterIndex: number,
    typeIndex: number,
    newValue: string
  ) => {
    setChapterData((prev) =>
      prev.map((chapter, cIdx) =>
        cIdx === chapterIndex
          ? {
              ...chapter,
              type: chapter.type.map((t, tIdx) =>
                tIdx === typeIndex ? newValue : t
              ),
            }
          : chapter
      )
    );
  };

  // Slok/Mantra handlers
  const handleSlokOrMantraChange = (
    chapterIndex: number,
    mantraIndex: number,
    key: "type" | "number" | "originalText",
    value: string | number
  ) => {
    setChapterData((prev) =>
      prev.map((chapter, cIdx) =>
        cIdx === chapterIndex
          ? {
              ...chapter,
              slokOrMantras: chapter.slokOrMantras.map((m, mIdx) =>
                mIdx === mantraIndex ? { ...m, [key]: value } : m
              ),
            }
          : chapter
      )
    );
  };

  // Translation text change (for langCode key)
  const handleSlokTranslationTextChange = (
    chapterIndex: number,
    mantraIndex: number,
    langCode: string,
    value: string
  ) => {
    setChapterData((prev) =>
      prev.map((chapter, cIdx) =>
        cIdx === chapterIndex
          ? {
              ...chapter,
              slokOrMantras: chapter.slokOrMantras.map((m, mIdx) =>
                mIdx === mantraIndex
                  ? {
                      ...m,
                      translations: {
                        ...m.translations,
                        [langCode]: value,
                      },
                    }
                  : m
              ),
            }
          : chapter
      )
    );
  };

  // Translation language code change (rename key)
  const handleSlokTranslationLangCodeChange = (
    chapterIndex: number,
    mantraIndex: number,
    oldLangCode: string,
    newLangCode: string
  ) => {
    if (oldLangCode === newLangCode) return;

    setChapterData((prev) =>
      prev.map((chapter, cIdx) => {
        if (cIdx !== chapterIndex) return chapter;

        return {
          ...chapter,
          slokOrMantras: chapter.slokOrMantras.map((m, mIdx) => {
            if (mIdx !== mantraIndex) return m;

            const newTranslations = { ...m.translations };
            // Rename key
            newTranslations[newLangCode] = newTranslations[oldLangCode] || "";
            delete newTranslations[oldLangCode];

            return {
              ...m,
              translations: newTranslations,
            };
          }),
        };
      })
    );
  };

  // Remove translation by langCode
  const removeSlokTranslation = (
    chapterIndex: number,
    mantraIndex: number,
    langCode: string
  ) => {
    setChapterData((prev) =>
      prev.map((chapter, cIdx) => {
        if (cIdx !== chapterIndex) return chapter;

        return {
          ...chapter,
          slokOrMantras: chapter.slokOrMantras.map((m, mIdx) => {
            if (mIdx !== mantraIndex) return m;

            const newTranslations = { ...m.translations };
            delete newTranslations[langCode];

            return {
              ...m,
              translations: newTranslations,
            };
          }),
        };
      })
    );
  };

  // Add empty translation (key/value) with empty langCode and text
  const addSlokTranslation = (chapterIndex: number, mantraIndex: number) => {
    setChapterData((prev) =>
      prev.map((chapter, cIdx) => {
        if (cIdx !== chapterIndex) return chapter;

        return {
          ...chapter,
          slokOrMantras: chapter.slokOrMantras.map((m, mIdx) => {
            if (mIdx !== mantraIndex) return m;

            return {
              ...m,
              translations: {
                ...m.translations,
                "": "",
              },
            };
          }),
        };
      })
    );
  };

  const handleUpdateBook = async (data: any) => {
    try {
      const chapters = data.chapters.map((chapter: any, index: number) => ({
        ...chapter,
        type: chapterData[index]?.type || [],
        slokOrMantras: chapterData[index]?.slokOrMantras || [],
      }));

      const payload = {
        title: data?.title,
        description: data?.description,
        chapters,
      };

      const response = await updateBook({
        id: book?.data?._id,
        data: payload,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Book updated successfully");
        setShowForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Update Book Details
          </h3>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Book Image */}
        <img
          src={book?.data?.imageUrl}
          alt="Book Cover"
          className="w-full h-64 object-cover rounded mb-4"
        />

        <form
          onSubmit={handleSubmit(handleUpdateBook)}
          className="flex flex-col gap-4"
        >
          <TextInput
            label="Book Title"
            placeholder="Enter Book Title"
            {...register("title", { required: "Title is required" })}
            error={errors.title}
          />
          <Textarea
            label="Description"
            placeholder="Write Short Description here..."
            rows={6}
            {...register("description")}
            isRequired={false}
          />

          {/* Chapter Fields */}
          {chapterData.map((chapter, chapterIndex) => (
            <EditChapters
              key={chapterIndex}
              chapterIndex={chapterIndex}
              chapter={chapter}
              register={register}
              errors={errors}
              handleTypeChange={handleTypeChange}
              handleAddType={handleAddType}
              handleRemoveType={handleRemoveType}
            />
          ))}

          {/* Sloks or Mantra fields for each chapter */}
          {chapterData.map((chapter, chapterIndex) =>
            chapter.slokOrMantras.map((mantra, mantraIndex) => (
              <div
                key={`${chapterIndex}-${mantraIndex}`}
                className="border border-gray-300 dark:border-gray-600 rounded p-4 mt-4"
              >
                <h4 className="font-semibold mb-2">
                  Slok / Mantra #{mantraIndex + 1} (Chapter {chapterIndex + 1})
                </h4>

                <SelectDropdown
                  label="Type"
                  onChange={(e) =>
                    handleSlokOrMantraChange(
                      chapterIndex,
                      mantraIndex,
                      "type",
                      e.target.value
                    )
                  }
                  options={["slok", "mantra"]}
                />

                <TextInput
                  label="Number"
                  type="number"
                  onChange={(e) =>
                    handleSlokOrMantraChange(
                      chapterIndex,
                      mantraIndex,
                      "number",
                      Number(e.target.value)
                    )
                  }
                  name={""}
                />

                <Textarea
                  label="Original Text"
                  value={mantra.originalText}
                  onChange={(e) =>
                    handleSlokOrMantraChange(
                      chapterIndex,
                      mantraIndex,
                      "originalText",
                      e.target.value
                    )
                  }
                  name={""}
                />

                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium">Translations</label>
                  {Object.entries(mantra.translations).map(
                    ([langCode, text], tIndex) => (
                      <div key={tIndex} className="mb-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={langCode}
                            onChange={(e) =>
                              handleSlokTranslationLangCodeChange(
                                chapterIndex,
                                mantraIndex,
                                langCode,
                                e.target.value
                              )
                            }
                            className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
                          >
                            <option value="">Select Language</option>
                            {languageOptions.map((lang) => (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              removeSlokTranslation(
                                chapterIndex,
                                mantraIndex,
                                langCode
                              )
                            }
                            className="text-red-500"
                          >
                            ×
                          </button>
                        </div>

                        <textarea
                          rows={3}
                          value={text}
                          onChange={(e) =>
                            handleSlokTranslationTextChange(
                              chapterIndex,
                              mantraIndex,
                              langCode,
                              e.target.value
                            )
                          }
                          placeholder="Enter translation"
                          className="w-full border px-2 py-1 mt-1 rounded dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      addSlokTranslation(chapterIndex, mantraIndex)
                    }
                    className="text-sm text-blue-600 underline"
                  >
                    + Add Another Translation
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="flex justify-end space-x-3 mt-5">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <SubmitButton isLoading={isUpdating} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
``;
