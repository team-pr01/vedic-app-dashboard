import { Trash } from "lucide-react";
import TextInput from "../../Reusable/TextInput/TextInput";

type TEditChaptersProps = {
  chapter: {
    chapterTitle: string;
    order: number;
    type: string[];
  };
  chapterIndex: number;
  register: any;
  errors: any;
  handleTypeChange: (
    chapterIndex: number,
    typeIndex: number,
    value: string
  ) => void;
  handleAddType: (chapterIndex: number) => void;
  handleRemoveType: (chapterIndex: number, typeIndex: number) => void;
};
const EditChapters: React.FC<TEditChaptersProps> = ({
  chapter,
  chapterIndex,
  register,
  errors,
  handleTypeChange,
  handleAddType,
  handleRemoveType,
}) => {
  return (
    <div className="p-4 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
      <h4 className="text-lg font-semibold mb-2 dark:text-white">
        Chapter {chapterIndex + 1}
      </h4>

      {/* chapterTitle (using register with dynamic name) */}
      <TextInput
        label="Chapter Title"
        placeholder="Enter Chapter Title"
        {...register(`chapters.${chapterIndex}.chapterTitle`, {
          required: "Title is required",
        })}
        defaultValue={chapter.chapterTitle}
        error={(errors?.chapters as any)?.[chapterIndex]?.chapterTitle}
      />

      {/* order */}
      <TextInput
        label="Order"
        placeholder="Enter Order"
        type="number"
        {...register(`chapters.${chapterIndex}.order`, {
          required: "Order is required",
          valueAsNumber: true,
        })}
        defaultValue={chapter.order}
        error={(errors?.chapters as any)?.[chapterIndex]?.order}
      />

      {/* Dynamic Type Fields */}
      <div className="space-y-2 mt-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Type(s)
        </label>
        {chapter.type.map((t: any, typeIndex: number) => (
          <div key={typeIndex} className="flex items-center gap-3">
            <input
              type="text"
              value={t}
              onChange={(e) =>
                handleTypeChange(chapterIndex, typeIndex, e.target.value)
              }
              placeholder={`Type ${typeIndex + 1}`}
              className="border px-3 py-2 rounded w-full dark:bg-gray-700 dark:text-white"
              required
            />
            {chapter.type.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveType(chapterIndex, typeIndex)}
                className="text-red-600"
                title="Delete type"
              >
                <Trash />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => handleAddType(chapterIndex)}
          className="text-sm text-blue-600 underline mt-2"
        >
          + Add Another Type
        </button>
      </div>
    </div>
  );
};

export default EditChapters;
