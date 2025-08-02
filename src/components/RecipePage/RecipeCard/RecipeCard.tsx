import { Edit2, Trash2 } from "lucide-react";
import { useDeleteRecipeMutation } from "../../../redux/Features/Recipe/recipeApi";
import toast from "react-hot-toast";
import { TRecipe } from "../../../pages/Recipe/Recipe";

type TRecipeCardProps = {
  recipe: TRecipe;
  setShowForm: (show: boolean) => void;
  setMode?: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setRecipeId?: React.Dispatch<React.SetStateAction<string>>;
};

const RecipeCard: React.FC<TRecipeCardProps> = ({
  recipe,
  setRecipeId,
  setShowForm,
  setMode,
}) => {
  const [deleteRecipe] = useDeleteRecipeMutation();
  const handleDeleteRecipe = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    toast.promise(deleteRecipe(id).unwrap(), {
      loading: "Deleting ...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };

  const getYouTubeVideoId = (url: string = "") => {
    const regExp =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : "";
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${getYouTubeVideoId(
          recipe?.videoUrl
        )}`}
        title={recipe?.name}
        className="w-full h-96 rounded-md"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {recipe.name}
        </h3>

        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
            {recipe.category}
          </span>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={() => {
              setRecipeId && setRecipeId(recipe?._id);
              setMode && setMode("edit");
              setShowForm(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteRecipe(recipe?._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
