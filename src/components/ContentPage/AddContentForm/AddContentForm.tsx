import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useState } from "react";
import Loader from "../../Shared/Loader/Loader";
import { useAddContentMutation } from "../../../redux/Features/Content/contentApi";
import { X } from "lucide-react";

type TFormValues = {
  imageUrl: string[];
  videoUrl: string[];
};

const AddContentForm = ({
  showForm,
  setShowForm,
}: {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [addContent, { isLoading }] = useAddContentMutation();
  const {
    handleSubmit,
    reset,
  } = useForm<TFormValues>();

  const [imageInput, setImageInput] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    urls: string[],
    setUrls: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed && !urls.includes(trimmed)) {
        setUrls([...urls, trimmed]);
      }
      setValue("");
    }
  };

  const removeUrl = (
    urlToRemove: string,
    urls: string[],
    setUrls: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const filtered = urls.filter((url) => url !== urlToRemove);
    setUrls(filtered);
  };

  const handleAddContent = async () => {
    const payload: TFormValues = {
      imageUrl: imageUrls,
      videoUrl: videoUrls,
    };

    try {
      await addContent(payload).unwrap();
      reset();
      setImageUrls([]);
      setVideoUrls([]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add content", error);
    }
  };

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleAddContent)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Content
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

            {/* Image URL input */}
            <div>
              <TextInput
                label="Image URL"
                name="imageUrl"
                placeholder="Enter image URL. Press enter to add"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyDown(e, imageInput, setImageInput, imageUrls, setImageUrls)
                }
                error={undefined}
                isRequired={false}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                  >
                    <span>{url}</span>
                    <button
                      type="button"
                      onClick={() => removeUrl(url, imageUrls, setImageUrls)}
                      className="ml-1 text-green-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Video URL input */}
            <div>
              <TextInput
                label="Video URL"
                name="videoUrl"
                placeholder="Enter video URL. Press enter to add"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyDown(e, videoInput, setVideoInput, videoUrls, setVideoUrls)
                }
                error={undefined}
                isRequired={false}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {videoUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm"
                  >
                    <span>{url}</span>
                    <button
                      type="button"
                      onClick={() => removeUrl(url, videoUrls, setVideoUrls)}
                      className="ml-1 text-purple-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? <Loader size="size-4" /> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddContentForm;
