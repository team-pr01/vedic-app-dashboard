import { Check, Trash2 } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../../../lib/languages";

type Translation = {
  language_code: string;
  translation: string;
  translator: string;
  is_verified: boolean;
};

type ReligiousText = {
  _id: string;
  veda_type: string;
  mandala_number?: number;
  sukta_number?: number;
  book_number?: number;
  chapter_number?: number;
  verse_number: number;
  is_published: boolean;
  original_text: string;
  devanagari_text?: string;
  transliteration?: string;
  translations?: Translation[];
};

type Props = {
  text: ReligiousText;
  setId: (id: string) => void;
  setMode: (mode: "add" | "edit") => void;
  setShowForm: (visible: boolean) => void;
};

export const ReligiousTextCard: React.FC<Props> = ({
  text,
  setId,
  setMode,
  setShowForm,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {text.veda_type === "rigveda"
              ? `Mandala ${text.mandala_number}, Sukta ${text.sukta_number}, Verse ${text.verse_number}`
              : `Book ${text.book_number}, Chapter ${text.chapter_number}, Verse ${text.verse_number}`}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
              text.is_published
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}
          >
            {text.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setId(text?._id);
              setMode("edit");
            }}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Check className="h-5 w-5" />
          </button>
          <button
            onClick={() => setId(text._id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Original Text
        </h4>
        <p className="text-gray-900 dark:text-white font-sanskrit">
          {text.original_text}
        </p>
        {text.devanagari_text && (
          <p className="mt-2 text-gray-600 dark:text-gray-400 font-devanagari">
            {text.devanagari_text}
          </p>
        )}
        {text.transliteration && (
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {text.transliteration}
          </p>
        )}
      </div>

      {text.translations && text.translations.length > 0 && (
        <div className="mt-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Translations
          </h4>
          {text.translations.map((translation, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {
                    SUPPORTED_LANGUAGES.find(
                      (l) => l.code === translation.language_code
                    )?.name
                  }
                </span>
                {translation.is_verified && (
                  <span className="text-green-600 dark:text-green-400">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
              <p className="text-gray-800 dark:text-gray-200">
                {translation.translation}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Translated by: {translation.translator}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
