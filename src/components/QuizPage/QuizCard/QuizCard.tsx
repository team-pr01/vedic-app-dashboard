import { Eye, Trash2 } from "lucide-react";
import { useDeleteQuizMutation } from "../../../redux/Features/Quiz/quizApi";
import toast from "react-hot-toast";

const QuizCard = ({ quiz, selectedQuizData, setSelectedQuizData }: any) => {
  const [deleteQuiz] = useDeleteQuizMutation();

  const handleDeleteQuiz = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    toast.promise(deleteQuiz(id).unwrap(), {
      loading: "Deleting...",
      success: "Quiz deleted successfully!",
      error: "Failed to delete Quiz.",
    });
  };
  return (
    <div
      className={`p-6 dark:bg-gray-800 rounded-lg shadow-md text-start h-fit ${
        selectedQuizData?._id === quiz?._id ? "bg-blue-100" : "bg-white"
      }`}
    >
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        {quiz?.title}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {quiz?.questions?.length || 0} questions
      </p>

      <div className="flex items-center gap-3 justify-between mt-4">
        <button
          onClick={() => setSelectedQuizData(quiz)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </button>
        <button
          onClick={() => handleDeleteQuiz(quiz?._id)}
          className="text-red-500 hover:text-red-600 flex items-center gap-2"
          type="button"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
