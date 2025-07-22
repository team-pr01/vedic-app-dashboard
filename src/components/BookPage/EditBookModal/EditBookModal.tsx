import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useEffect, useState } from "react";
import Textarea from "../../Reusable/TextArea/TextArea";
import { useUpdateBookMutation } from "../../../redux/Features/Book/bookApi";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";

type TEditBookModalProps = {
  book: any;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
};

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
        }))
      );
    }
  }, [book, setValue]);

  const handleAddType = (chapterIndex: number) => {
  setChapterData(prev =>
    prev.map((chapter, idx) =>
      idx === chapterIndex
        ? { ...chapter, type: [...chapter.type, ""] }
        : chapter
    )
  );
};


 const handleRemoveType = (chapterIndex: number, typeIndex: number) => {
  setChapterData(prev =>
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
  setChapterData(prev =>
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


 const handleChapterChange = (
  chapterIndex: number,
  field: "chapterTitle" | "order",
  value: string | number
) => {
  setChapterData(prev =>
    prev.map((chapter, idx) =>
      idx === chapterIndex ? { ...chapter, [field]: value } : chapter
    )
  );
};

  const handleUpdateBook = async (data: any) => {
    try {
      const chapters = data.chapters.map((chapter: any, index: number) => ({
        ...chapter,
        type: chapterData[index]?.type || [],
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
            <div
              key={chapterIndex}
              className="p-4 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
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
                error={errors?.chapters?.[chapterIndex]?.chapterTitle}
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
                error={errors?.chapters?.[chapterIndex]?.order}
              />

              {/* Dynamic Type Fields */}
              <div className="space-y-2 mt-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type(s)
                </label>
                {chapter.type.map((t, typeIndex) => (
                  <div key={typeIndex} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={t}
                      onChange={(e) =>
                        handleTypeChange(
                          chapterIndex,
                          typeIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Type ${typeIndex + 1}`}
                      className="border px-3 py-2 rounded w-full dark:bg-gray-700 dark:text-white"
                      required
                    />
                    {chapter.type.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveType(chapterIndex, typeIndex)
                        }
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
          ))}

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
