import { useForm } from "react-hook-form";
import { LANGUAGES } from "../../../lib/allLanguages";
import Textarea from "../../Reusable/TextArea/TextArea";
import { SparklesIcon } from "lucide-react";
import { useState } from "react";

const TranslateBookModal = ({ data, setIsTranslateModalOpen } : {data: any, setIsTranslateModalOpen: any}) => {
    console.log(data);
  const [selectedLanguages, setSelectedLanguages] = useState<any[]>([]);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  const toggleLanguage = (language: any, checked: boolean) => {
    if (checked) setSelectedLanguages((prev) => [...prev, language]);
    else
      setSelectedLanguages((prev) =>
        prev.filter((lang) => lang.code !== language.code)
      );
  };

  const handleLanguageClick = (language: any) => {
  setActiveLanguage(language.code);
};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 flex flex-col max-h-[75vh]">
          <div className="mb-4 flex flex-col justify-end">
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
            <button className="flex items-center text-xs gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed w-fit ml-auto">
              <SparklesIcon className="w-5 h-5" />
              Generate by AI
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
            </div>
            <div className="md:col-span-8 max-h-[calc(65vh-3rem)] overflow-y-auto pr-2 space-y-4">
              {LANGUAGES.map((lang) => (
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
                      {...register("originalText")}
                      error={errors.originalText as import("react-hook-form").FieldError | undefined}
                    />
                    <Textarea
                      label="Word-by-Word (পদ)"
                      {...register("wordByWord")}
                      error={errors.wordByWord as import("react-hook-form").FieldError | undefined}
                    />
                    <Textarea
                      label="Word Meanings (পদার্থ)"
                      {...register("wordMeanings")}
                      error={errors.wordMeanings as import("react-hook-form").FieldError | undefined}
                    />
                  </div>
                </div>
              ))}
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
            type="button"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslateBookModal;
