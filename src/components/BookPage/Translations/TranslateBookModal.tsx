import { useForm } from "react-hook-form";
import { LANGUAGES } from "../../../lib/allLanguages";
import Textarea from "../../Reusable/TextArea/TextArea";
import { SparklesIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslateTextMutation } from "../../../redux/Features/Book/textsApi";
import toast from "react-hot-toast";

interface TranslationFormData {
  translations: {
    [langCode: string]: {
      translation: string;
      wordByWord: string;
      wordMeanings: string;
    };
  };
}

interface SanskritWord {
  sanskritWord: string;
  shortMeaning: string;
  descriptiveMeaning: string;
}

interface Translation {
  langCode: string;
  translation: string;
  sanskritWordBreakdown?: SanskritWord[];
}

interface BookTextData {
  _id: string;
  originalText: string;
  primaryTranslation: string;
  translations?: Translation[];
  location: Array<{ levelName: string; value: string }>;
  tags: string[];
  isVerified: boolean;
  bookId: {
    _id: string;
    name: string;
    type: string;
    structure: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const TranslateBookModal = ({
  data,
  setIsTranslateModalOpen,
}: {
  data: BookTextData;
  setIsTranslateModalOpen: (isOpen: boolean) => void;
}) => {
  const [translateText, { isLoading: isTranslating }] =
    useTranslateTextMutation();
  const [selectedLanguages, setSelectedLanguages] = useState<any[]>([]);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TranslationFormData>({
    defaultValues: {
      translations: {},
    },
  });

  // Initialize form with existing data
  useEffect(() => {
    if (data?.translations) {
      const initialTranslations: TranslationFormData["translations"] = {};

      data.translations.forEach((trans: Translation) => {
        // Combine word-by-word translations
        const wordByWord =
          trans.sanskritWordBreakdown
            ?.map((word) => `${word.sanskritWord} - ${word.shortMeaning}`)
            .join("\n") || "";

        // Combine word meanings
        const wordMeanings =
          trans.sanskritWordBreakdown
            ?.map((word) => `${word.sanskritWord} - ${word.descriptiveMeaning}`)
            .join("\n") || "";

        initialTranslations[trans.langCode] = {
          translation: trans.translation,
          wordByWord,
          wordMeanings,
        };
      });

      reset({ translations: initialTranslations });
    }
  }, [data, reset]);

  const toggleLanguage = (language: any, checked: boolean) => {
    if (checked) {
      setSelectedLanguages((prev) => [...prev, language]);
    } else {
      setSelectedLanguages((prev) =>
        prev.filter((lang) => lang.code !== language.code)
      );
    }
  };

  const handleLanguageClick = (language: any) => {
    setActiveLanguage(language.code);
  };

  const handleTranslateLanguage = async () => {
    if (!data?._id || selectedLanguages.length === 0) {
      toast.error("Please select at least one language");
      return;
    }

    const languageCodes = selectedLanguages.map((lang) => lang.code);

    try {
      const payload = {
        textId: data._id,
        languageCodes,
      };
      const response = await translateText(payload).unwrap();

      toast.success("Shloka translated successfully!");

      // Update form with new translations
      if (response.translations) {
        const currentTranslations = watch("translations") || {};
        const updatedTranslations = { ...currentTranslations };

        response.translations.forEach((trans: Translation) => {
          const wordByWord =
            trans.sanskritWordBreakdown
              ?.map((word) => `${word.sanskritWord} - ${word.shortMeaning}`)
              .join("\n") || "";

          const wordMeanings =
            trans.sanskritWordBreakdown
              ?.map(
                (word) => `${word.sanskritWord} - ${word.descriptiveMeaning}`
              )
              .join("\n") || "";

          updatedTranslations[trans.langCode] = {
            translation: trans.translation,
            wordByWord,
            wordMeanings,
          };
        });

        reset({ translations: updatedTranslations });
      }
    } catch (error: any) {
      const errMsg =
        error?.data?.message || "Something went wrong during translation";
      toast.error(errMsg);
      console.error(error);
    }
  };

  const onSubmit = (formData: TranslationFormData) => {
    console.log("Form data to save:", formData);

    // Transform form data back to the expected API format
    const translationsToSave: Translation[] = Object.entries(
      formData.translations || {}
    ).map(([langCode, transData]) => {
      // Parse word-by-word and word meanings back to SanskritWord format
      const sanskritWordBreakdown: SanskritWord[] = [];

      if (transData.wordByWord && transData.wordMeanings) {
        const wordByWordLines = transData.wordByWord
          .split("\n")
          .filter((line) => line.trim());
        const wordMeaningsLines = transData.wordMeanings
          .split("\n")
          .filter((line) => line.trim());

        // Match corresponding lines
        wordByWordLines.forEach((line, index) => {
          const [sanskritWord, shortMeaning] = line.split(" - ");
          const meaningLine = wordMeaningsLines[index];
          const descriptiveMeaning = meaningLine
            ? meaningLine.split(" - ")[1] || ""
            : "";

          if (sanskritWord && shortMeaning) {
            sanskritWordBreakdown.push({
              sanskritWord: sanskritWord.trim(),
              shortMeaning: shortMeaning.trim(),
              descriptiveMeaning: descriptiveMeaning.trim(),
            });
          }
        });
      }

      return {
        langCode,
        translation: transData.translation,
        sanskritWordBreakdown:
          sanskritWordBreakdown.length > 0 ? sanskritWordBreakdown : undefined,
      };
    });

    console.log("Processed translations:", translationsToSave);
    toast.success("Translations saved successfully!");
    // Here you would typically make an API call to save the data
    // await saveTranslationsAPI(data._id, translationsToSave);
  };

  const currentTranslations = watch("translations") || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex flex-col max-h-[75vh]">
            <div className="mb-4 flex flex-col justify-end">
              <div className="flex items-center w-full overflow-x-auto gap-4 mt-3">
                {LANGUAGES.map((language) => {
                  const isChecked = selectedLanguages.some(
                    (lang) => lang.code === language.code
                  );
                  return (
                    <div
                      key={language.code}
                      className="flex items-center gap-2"
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          toggleLanguage(language, e.target.checked)
                        }
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
              <button
                type="button"
                onClick={handleTranslateLanguage}
                className="flex items-center text-xs gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed w-fit ml-auto mt-3"
              >
                <SparklesIcon className="w-5 h-5" />
                {isTranslating ? "Translating..." : "Generate by AI"}
              </button>
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto">
              <div className="md:col-span-4 space-y-4">
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg sticky top-0">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    ORIGINAL TEXT (SANSKRIT)
                  </label>
                  <p className="mt-1 text-slate-700 dark:text-slate-200 whitespace-pre-wrap font-serif text-lg">
                    {data?.originalText}
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    PRIMARY TRANSLATION
                  </label>
                  <p className="mt-1 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                    {data?.primaryTranslation}
                  </p>
                </div>
              </div>
              <div className="md:col-span-8 max-h-[calc(65vh-3rem)] overflow-y-auto pr-2 space-y-4">
                {LANGUAGES.map((lang) => {
                  const langData = currentTranslations[lang.code] || {
                    translation: "",
                    wordByWord: "",
                    wordMeanings: "",
                  };

                  return (
                    <div
                      key={lang.code}
                      className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg"
                    >
                      <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-3">
                        {lang.name}
                      </h4>
                      <div className="space-y-4">
                        <Textarea
                          label="Translation (ভাবার্থ)"
                          value={langData.translation}
                          onChange={(e) =>
                            setValue(
                              `translations.${lang.code}.translation`,
                              e.target.value
                            )
                          }
                          error={
                            errors.translations?.[lang.code]?.translation as
                              | import("react-hook-form").FieldError
                              | undefined
                          }
                        />
                        <Textarea
                          label="Word-by-Word (পদ)"
                          value={langData.wordByWord}
                          onChange={(e) =>
                            setValue(
                              `translations.${lang.code}.wordByWord`,
                              e.target.value
                            )
                          }
                          error={
                            errors.translations?.[lang.code]?.wordByWord as
                              | import("react-hook-form").FieldError
                              | undefined
                          }
                          placeholder="Format: SanskritWord - ShortMeaning&#10;e.g., ॐ - 45"
                        />
                        <Textarea
                          label="Word Meanings (পদার্থ)"
                          value={langData.wordMeanings}
                          onChange={(e) =>
                            setValue(
                              `translations.${lang.code}.wordMeanings`,
                              e.target.value
                            )
                          }
                          error={
                            errors.translations?.[lang.code]?.wordMeanings as
                              | import("react-hook-form").FieldError
                              | undefined
                          }
                          placeholder="Format: SanskritWord - DescriptiveMeaning&#10;e.g., ॐ - the periodical sound, the existence"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button
              onClick={() => setIsTranslateModalOpen(false)}
              type="button"
              className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TranslateBookModal;
