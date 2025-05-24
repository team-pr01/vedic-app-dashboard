import { Edit2, Trash2 } from "lucide-react";

const ReelCard = ({reel, setShowForm} : {reel: any, setShowForm: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const handleDelete = (id: string) => {
    console.log("object", id);
  };

  const getEmbedUrl = (url: string, source: string) => {
    if (source === 'youtube') {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/);
      return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
    }
    return url;
  };
    return (
         <div
            key={reel.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="aspect-video">
              <iframe
                src={getEmbedUrl(reel.url, reel.source)}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {reel.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-2">
                    {reel.source}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(reel.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {reel.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {reel.tags.map((tag:string, index:number) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Added {new Date(reel.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
    );
};

export default ReelCard;