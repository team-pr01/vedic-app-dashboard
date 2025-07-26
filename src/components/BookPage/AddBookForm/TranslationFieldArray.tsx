import { useFieldArray, UseFormReturn } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import { Minus, Plus } from "lucide-react";
import Textarea from "../../Reusable/TextArea/TextArea";

type TranslationFieldProps = {
  control: UseFormReturn["control"];
  register: UseFormReturn["register"];
  sectionIndex: number;
  contentIndex: number;
  innerContentIndex: number;
};

export const TranslationFieldArray = ({
  control,
  register,
  sectionIndex,
  contentIndex,
  innerContentIndex,
}: TranslationFieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.contents.${contentIndex}.contents.${innerContentIndex}.translations`,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Translations</h3>
        <button
          type="button"
          onClick={() => append({ language: "", title: "", description: "" })}
          className="text-blue-600 text-sm flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Translation
        </button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-md space-y-4 bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-700">
              Translation #{index + 1}
            </p>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 text-sm flex items-center gap-1"
            >
              <Minus className="h-4 w-4" />
              Remove
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <TextInput
              label="Language"
              placeholder="Ex: en, bn, hi"
              {...register(
                `sections.${sectionIndex}.contents.${contentIndex}.contents.${innerContentIndex}.translations.${index}.language`
              )}
            />
            <Textarea
              label="Description"
              placeholder="Enter translated description"
              rows={6}
              {...register(
                `sections.${sectionIndex}.contents.${contentIndex}.contents.${innerContentIndex}.translations.${index}.description`
              )}
              isRequired={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
