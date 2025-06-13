import { Pen, Trash2 } from "lucide-react";
import { useDeleteReligiousTextMutation } from "../../../redux/Features/Religious Texts/religiousTextsApi";
import toast from "react-hot-toast";

type Translation = {
  language_code: string;
  translation: string;
  translator: string;
  is_verified: boolean;
};

export type TReligiousText = {
  _id: string;
  vedaName: string;
  originalText: string;
  devanagariText?: string;
  hindiTranslation?: string;
  englishTranslation?: string;
  tags?: string[];
  notes?: string;
  // Rigved
  mandala?: number | null;

  // Samved
  section?: "Purvarchika" | "Uttararchika" | "";
  chantNumber?: number | null;

  // Yajurved
  branch?: "Shukla" | "Krishna" | "";
  chapterNumber?: number | null;
  verseNumber?: number | null;

  // Atharvaved
  kandNumber?: number | null;
  suktaNumber?: number | null;
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
  text: TReligiousText;
  setId: (id: string) => void;
  setMode: (mode: "add" | "edit") => void;
  setShowForm: (visible: boolean) => void;
  setSelectedVeda: (veda: string) => void;
};

export const ReligiousTextCard: React.FC<Props> = ({
  text,
  setId,
  setMode,
  setShowForm,
  setSelectedVeda,
}) => {
  const [deleteReligiousText] = useDeleteReligiousTextMutation();

  const handleReligiousText = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    toast.promise(deleteReligiousText(id).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
            {text?.vedaName}
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setId(text?._id);
              setSelectedVeda(text?.vedaName?.toLocaleLowerCase() || "");
              setMode("edit");
              setShowForm(true);
            }}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Pen className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={() => handleReligiousText(text?._id)}
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
          {text?.originalText}
        </p>
        {text.devanagariText && (
          <p className="mt-2 text-gray-600 dark:text-gray-400 font-devanagari">
            {text.devanagariText}
          </p>
        )}
        {text.transliteration && (
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {text.transliteration}
          </p>
        )}
      </div>

      <div className="mt-4 space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Translations
        </h4>
        {text?.englishTranslation && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              English
            </span>
            <p className="text-gray-800 dark:text-gray-200 mt-2">
              {text?.englishTranslation}
            </p>
          </div>
        )}
        {text?.hindiTranslation && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hindi
            </span>
            <p className="text-gray-800 dark:text-gray-200 mt-2">
              {text?.hindiTranslation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
