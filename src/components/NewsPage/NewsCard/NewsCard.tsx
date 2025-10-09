import { Trash2, Calendar, Edit2, Eye, Heart } from "lucide-react";
import { format } from "date-fns";

export type TNews = {
  _id: string;
  translations: {
    [key: string]: {
      title: string;
      category: string;
      content: string;
      tags: string[];
    };
  };
  imageUrl?: string;
  createdAt: string;
  views?: number;
  likes?: number;
};

type TNewsCardProps = {
  article: TNews;
  setId: (id: string) => void;
  setMode: any;
  setShowForm: (show: boolean) => void;
  handleDeleteNews: (id: string) => void;
};

const NewsCard: React.FC<TNewsCardProps> = ({
  article,
  setId,
  setMode,
  setShowForm,
  handleDeleteNews,
}) => {
  const translation = article.translations?.en;

  const handleEdit = () => {
    setId(article._id);
    setMode("edit");
    setShowForm(true);
  };

  if (!translation) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {article?.imageUrl && (
        <img
          src={article.imageUrl}
          alt={translation.title}
          className="w-full h-80 object-cover rounded-t-lg"
        />
      )}

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {translation.title}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {translation.category}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeleteNews(article._id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {translation.tags?.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Date, Views, Likes */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(article.createdAt), "MMM d, yyyy")}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{article.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{article.likes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
