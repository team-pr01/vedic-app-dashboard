import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import Loader from "../../components/Shared/Loader/Loader";
import { useGetAllRecipiesQuery, useGetSingleRecipeQuery } from "../../redux/Features/Recipe/recipeApi";
import Categories from "../../components/Categories/Categories";
import AddRecipeForm from "../../components/RecipePage/AddRecipeForm/AddRecipeForm";
import RecipeCard from "../../components/RecipePage/RecipeCard/RecipeCard";

export type TRecipe = {
  _id: string;
  name: string;
  videoUrl: string;
  category: string;
  duration: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Recipe = () => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useGetAllRecipiesQuery({});
  const [recipeId, setRecipeId] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");

  const { data: singleRecipeData } = useGetSingleRecipeQuery(recipeId);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Recipes"
        buttonText="Add New Recipe"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setMode && setMode("add");
          setShowForm(true);
        }}
        setShowCategoryForm={setShowCategoryForm}
      />

      {isLoading ? (
        <Loader size="size-10" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((recipe: TRecipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              setShowForm={setShowForm}
              setMode={setMode}
              setRecipeId={setRecipeId}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <AddRecipeForm
        showForm={showForm}
        setShowForm={setShowForm}
        defaultValues={singleRecipeData?.data}
        mode={mode}
      />

      {/* Category management */}
      <Categories
        showModal={showCategoryForm}
        setShowModal={setShowCategoryForm}
        areaName="recipe"
      />
    </div>
  );
};

export default Recipe;
