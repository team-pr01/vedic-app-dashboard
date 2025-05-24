import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";

type TFormValues = {
  title: string;
  description: string;
  videoSource: string;
  videoUrl: string;
  category: string;
  tags: string[];
};


const AddReelForm = ({showForm, setShowForm} : {showForm: boolean, setShowForm: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormValues>();
  const handleAddReel = (data:TFormValues) => {
   console.log("object", data);
  };
  
  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
          <form
            onSubmit={handleSubmit(handleAddReel)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Reel
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <TextInput
                label="Title"
                placeholder="Enter video title"
                {...register("title", { required: "Title is required" })}
                error={errors.title}
              />

              <Textarea
                label="Description"
                placeholder="Write description here..."
                rows={6}
                error={errors.description}
                {...register("description", {
                  required: "Description is required",
                })}
              />

              <TextInput
                label="Video Source"
                placeholder="Enter video source (e.g., youtube, vimeo)"
                {...register("videoSource", {
                  required: "Video source is required",
                })}
                error={errors.videoSource}
              />

              <TextInput
                label="Video Url"
                placeholder="Enter video URL"
                {...register("videoUrl", { required: "Video Url is required" })}
                error={errors.videoUrl}
              />

              <TextInput
                label="Category"
                placeholder="Enter video category"
                {...register("category", { required: "category is required" })}
                error={errors.category}
              />

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newReel.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setNewReel({
                      ...newReel,
                      tags: e.target.value.split(",").map((tag) => tag.trim()),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="meditation, vedic, tutorial"
                />
              </div> */}
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
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddReelForm;
