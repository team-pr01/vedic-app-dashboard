import { Plus } from 'lucide-react';
import TextInput from '../../Reusable/TextInput/TextInput';
import Textarea from '../../Reusable/TextArea/TextArea';
import { TranslationFieldArray } from './TranslationFieldArray';
import { useFieldArray } from 'react-hook-form';

const ContentInnerBlock = ({ control, register, sectionIndex, contentIndex }: any) => {
    const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.contents.${contentIndex}.contents`,
  });
    return (
        <div className="ml-4">
      <button
        type="button"
        onClick={() =>
          append({ name: "", number: "", originalText: "", translations: {} })
        }
        className="text-blue-600 text-sm flex items-center gap-1 mt-3"
      >
        <Plus className="h-4 w-4" /> Add Inner Content
      </button>

      {fields.map((field, index) => (
        <div key={field.id} className="bg-gray-100 p-4 rounded-xl mt-3">
          <div className="flex justify-between items-center">
            <h5 className="text-md font-medium">Inner Content {index + 1}</h5>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500"
            >
              × Remove
            </button>
          </div>

          <TextInput
            label="Name"
            placeholder="Ex: Slok, Mantra etc"
            {...register(
              `sections.${sectionIndex}.contents.${contentIndex}.contents.${index}.name`
            )}
          />
          <TextInput
            label="Number"
            placeholder="Ex: Mantra no, Slok No etc"
            {...register(
              `sections.${sectionIndex}.contents.${contentIndex}.contents.${index}.number`
            )}
          />
          <Textarea
            label="Original Text"
            rows={6}
            placeholder="Write original text here..."
            {...register(
              `sections.${sectionIndex}.contents.${contentIndex}.contents.${index}.originalText`
            )}
          />

         <TranslationFieldArray
  control={control}
  register={register}
  sectionIndex={sectionIndex}
  contentIndex={contentIndex}
  innerContentIndex={index}
/>


        </div>
      ))}
    </div>
    );
};

export default ContentInnerBlock;