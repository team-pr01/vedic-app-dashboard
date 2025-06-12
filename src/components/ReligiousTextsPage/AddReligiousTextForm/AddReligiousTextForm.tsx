import { useForm } from "react-hook-form";
import Textarea from "../../Reusable/TextArea/TextArea";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useState } from "react";
import { X } from "lucide-react";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useAddReligiousTextsApiMutation } from "../../../redux/Features/Religious Texts/religiousTextsApi";

type TFormValues = {
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
};

type TAddReligiousTextFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "add" | "edit";
  defaultValues?: any;
  selectedVeda: any;
};
const AddReligiousTextForm: React.FC<TAddReligiousTextFormProps> = ({
  showForm,
  setShowForm,
  mode,
  defaultValues,
  selectedVeda,
}) => {
  const [addReligiousTextsApi, { isLoading }] =
    useAddReligiousTextsApiMutation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

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

  const handleAddReligiousText = async (data: TFormValues) => {
    try {
      const payload = {
        vedaName: selectedVeda,
        originalText: data.originalText,
        devanagariText: data.devanagariText,
        hindiTranslation: data.hindiTranslation,
        englishTranslation: data.englishTranslation,
        notes: data.notes,
        mandala: data.mandala,
        section: data.section,
        chantNumber: data.chantNumber,
        branch: data.branch,
        chapterNumber: data.chapterNumber,
        verseNumber: data.verseNumber,
        kandNumber: data.kandNumber,
        suktaNumber: data.suktaNumber,
        tags: tags,
      };
      const response = await addReligiousTextsApi(payload).unwrap();
      if (response?.success) {
        setShowForm(false);
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isUpdating = false;

  console.log(selectedVeda);

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto p-5">
          <form
            onSubmit={handleSubmit(handleAddReligiousText)}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Religious Text
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

            <Textarea
              label="Original Text (Sanskrit)"
              placeholder="Write Original Text (Sanskrit) here..."
              rows={6}
              error={errors.originalText}
              {...register("originalText", {
                required: "Original Text (Sanskrit) is required",
              })}
            />
            <Textarea
              label="Devanagari Text"
              placeholder="Write Devanagari Text here..."
              rows={6}
              error={errors.devanagariText}
              {...register("devanagariText")}
              isRequired={false}
            />
            <Textarea
              label="Hindi Translation"
              placeholder="Write Translation here..."
              rows={6}
              error={errors.hindiTranslation}
              {...register("hindiTranslation")}
              isRequired={false}
            />
            <Textarea
              label="English Translation"
              placeholder="Write Translation here..."
              rows={6}
              error={errors.englishTranslation}
              {...register("englishTranslation")}
              isRequired={false}
            />

            {selectedVeda === "rigveda" && (
              <TextInput
                label="Mandala Number"
                placeholder="Enter Mandala Number"
                type="number"
                {...register("mandala")}
                error={errors.mandala}
                isRequired={false}
              />
            )}

            {selectedVeda === "samaveda" && (
              <SelectDropdown
                label="Section"
                {...register("section")}
                error={errors?.section}
                options={["Purvarchika", "Uttararchika"]}
                isRequired={false}
              />
            )}

            {selectedVeda === "samaveda" && (
              <TextInput
                label="Chant Number"
                placeholder="Enter Chant Number"
                type="number"
                {...register("chantNumber")}
                error={errors.chantNumber}
                isRequired={false}
              />
            )}

            {selectedVeda === "yajurveda" && (
              <SelectDropdown
                label="Branch"
                {...register("branch")}
                error={errors?.branch}
                options={["Shukla", "Krishna"]}
                isRequired={false}
              />
            )}

            {selectedVeda === "yajurveda" && (
              <TextInput
                label="Chapter Number"
                placeholder="Enter Chapter Number"
                type="number"
                {...register("chapterNumber")}
                error={errors.chapterNumber}
                isRequired={false}
              />
            )}

            {(selectedVeda === "rigveda" ||
              selectedVeda === "yajurveda" ||
              selectedVeda === "atharvaveda") && (
              <TextInput
                label="Verse Number"
                placeholder="Enter Verse Number"
                type="number"
                {...register("verseNumber")}
                error={errors.verseNumber}
                isRequired={false}
              />
            )}

            {selectedVeda === "atharvaveda" && (
              <TextInput
                label="Kand Number"
                placeholder="Enter Kand Number"
                type="number"
                {...register("kandNumber")}
                error={errors.kandNumber}
                isRequired={false}
              />
            )}

            {(selectedVeda === "rigveda" || selectedVeda === "atharvaveda") && (
              <TextInput
                label="Sukta Number"
                placeholder="Enter Sukta Number"
                type="number"
                {...register("suktaNumber")}
                error={errors.suktaNumber}
                isRequired={false}
              />
            )}

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

            <Textarea
              label="Notes"
              placeholder="Write notes here..."
              rows={6}
              error={errors.notes}
              {...register("notes", {
                required: "Note is required",
              })}
            />

            <div className="flex justify-end space-x-3 mt-5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <SubmitButton isLoading={isLoading || isUpdating} />
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddReligiousTextForm;
