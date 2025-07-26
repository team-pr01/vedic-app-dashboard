import { Plus } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import ContentInnerBlock from "./ContentInnerBlock";

type TProps = {
  control: any;
  register: any;
  sectionIndex: number;
};

const SectionContentBlock = ({ control, register, sectionIndex }: TProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.contents`,
  });

  return (
    <div className="ml-4">
      <button
        type="button"
        onClick={() => append({ type: "", number: "", contents: [] })}
        className="text-blue-600 text-sm flex items-center gap-1"
      >
        <Plus className="h-4 w-4" /> Add Content
      </button>

      {fields.map((field, contentIndex) => (
        <div key={field.id} className="bg-white p-4 rounded-xl mt-4">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium">Content {contentIndex + 1}</h4>
            <button
              type="button"
              onClick={() => remove(contentIndex)}
              className="text-red-500"
            >
              × Remove
            </button>
          </div>

          <TextInput
            label="Type"
            placeholder="Ex: Sukta, Sarga etc"
            {...register(`sections.${sectionIndex}.contents.${contentIndex}.type`)}
          />
          <TextInput
            label="Number"
            placeholder="Ex: Sukta no, Sarga No etc"
            {...register(`sections.${sectionIndex}.contents.${contentIndex}.number`)}
          />

          {/* ✅ Correctly pass indexes for inner contents */}
          <ContentInnerBlock
            control={control}
            register={register}
            sectionIndex={sectionIndex}
            contentIndex={contentIndex}
          />
        </div>
      ))}
    </div>
  );
};

export default SectionContentBlock;
