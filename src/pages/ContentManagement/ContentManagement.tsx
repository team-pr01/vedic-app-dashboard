import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import AddContentForm from "../../components/ContentPage/AddContentForm/AddContentForm";
import {
  useGetAllContentsQuery,
  useDeleteContentMutation,
} from "../../redux/Features/Content/contentApi";
import Loader from "../../components/Shared/Loader/Loader";
import toast from "react-hot-toast";

const getEmbeddedUrl = (url: string) => {
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  } else if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  return null;
};

const ContentManagement = () => {
  const { data, isLoading, refetch } = useGetAllContentsQuery({});
  const [deleteContent] = useDeleteContentMutation();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async ({
    contentId,
    type,
    url,
  }: {
    contentId: string;
    type: "image" | "video";
    url: string;
  }) => {
    const toastId = toast.loading("Deleting content...");
    try {
      setDeletingId(contentId + url); // Unique ID to handle concurrent deletes
      await deleteContent({ contentId, type, url }).unwrap();
      toast.success("Deleted successfully", { id: toastId });
      refetch();
    } catch (error) {
      toast.error("Failed to delete", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Content Management"
        buttonText="Add New Content"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => setShowForm(true)}
      />

      {isLoading ? (
        <Loader size="size-10" />
      ) : data?.data?.length < 1 ? (
        <p className="text-center text-gray-500 dark:text-gray-100">
          No data found
        </p>
      ) : (
        <>
          {/* Images */}
          <h1 className="text-xl font-semibold text-gray-600 dark:text-gray-100">
            Images
          </h1>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 bg-gray-200/80 dark:bg-gray-800 p-4 rounded-xl">
            {data?.data?.flatMap((content: any) =>
              content?.imageUrl?.map((url: string, index: number) => {
                const isDeleting = deletingId === content._id + url;
                return (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Content Image ${index + 1}`}
                      className="rounded-lg h-82 object-cover w-full"
                    />
                    <button
                      onClick={() =>
                        handleDelete({
                          contentId: content._id,
                          type: "image",
                          url,
                        })
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 transition size-8 flex items-center justify-center"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <span className="loader size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        "✕"
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Videos */}
          <h1 className="text-xl font-semibold mt-16 text-gray-600 dark:text-gray-100">
            Videos
          </h1>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 bg-gray-200/80 dark:bg-gray-800 p-4 rounded-xl">
            {data?.data?.flatMap((content: any) =>
              content?.videoUrl?.map((url: string, index: number) => {
                const embedUrl = getEmbeddedUrl(url);
                const isDeleting = deletingId === content._id + url;

                return (
                  <div key={index} className="relative group">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={`Video ${index + 1}`}
                        width="100%"
                        height="300"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg w-full"
                      />
                    ) : (
                      <video
                        controls
                        className="rounded-lg h-82 object-cover w-full"
                      >
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    <button
                      onClick={() =>
                        handleDelete({
                          contentId: content._id,
                          type: "video",
                          url,
                        })
                      }
                      className="absolute top-2 right-2 size-8 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition flex items-center justify-center"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <span className="loader size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        "✕"
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Add Form Modal */}
      {showForm && (
        <AddContentForm showForm={showForm} setShowForm={setShowForm} />
      )}
    </div>
  );
};

export default ContentManagement;
