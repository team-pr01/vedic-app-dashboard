import { Eye, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

type TArticle = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: "published" | "draft" | string;
  featured_image?: string;
  tags: string[];
  created_at: string;
};

type TNewsCardProps = {
  article: TArticle;
  setId: (id: string) => void;
  setMode: (mode: "add" | "edit") => void;
  setShowForm: (show: boolean) => void;
};

const NewsCard: React.FC<TNewsCardProps> = ({
  article,
  setId,
  setMode,
  setShowForm,
}) => {
  const handleEdit = () => {
    setId(article.id);
    setMode("add");
    setShowForm(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {article.featured_image && (
        <img
          src={article.featured_image}
          alt={article.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {article.title}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                article.status === "published"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : article.status === "draft"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              }`}
            >
              {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {article.excerpt ||
            article.content.replace(/<[^>]*>/g, "").substring(0, 150) + "..."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(article.created_at), "MMM d, yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
