import { Clock, Edit2, Trash2 } from "lucide-react";

type TYogaCardProps = {
  yoga: any;
  setShowForm: (visible: boolean) => void;
};
const YogaCard: React.FC<TYogaCardProps> = ({ yoga, setShowForm }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {yoga.videoUrl ? (
        <div className="relative w-full h-48">
          <iframe
            src={yoga.videoUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <img
          src={yoga.imageUrl}
          alt={yoga.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {yoga.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {yoga.sanskritName}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              yoga.difficulty === "beginner"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : yoga.difficulty === "intermediate"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {yoga.difficulty}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {yoga.description}
        </p>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Benefits:
          </h4>
          <ul className="mt-2 space-y-1">
            {yoga.benefits.map((benefit: string, index: number) => (
              <li
                key={index}
                className="text-sm text-gray-600 dark:text-gray-300 flex items-center"
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-1" />
          {Math.floor(yoga.duration / 60)}m {yoga.duration % 60}s
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {yoga.category.map((category: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={() => {
              setShowForm(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default YogaCard;
