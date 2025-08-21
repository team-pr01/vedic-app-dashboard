import { Plus } from "lucide-react";
import { useState } from "react";
import AddManualQuizModal from "../../components/QuizPage/AddManualQuizModal/AddManualQuizModal";
import AddAIQuizModal from "../../components/QuizPage/AddAIQuizModal/AddAIQuizModal";
import { useGetAllQuizzesQuery } from "../../redux/Features/Quiz/quizApi";
import Loader from "../../components/Shared/Loader/Loader";
import QuizCard from "../../components/QuizPage/QuizCard/QuizCard";
import QuizDetails from "../../components/QuizPage/QuizCard/QuizDetails";

const Quiz = () => {
  const [selectedQuizData, setSelectedQuizData] = useState<any>(null);
  const { data, isLoading } = useGetAllQuizzesQuery({});
  const [addManualQuizFormOpen, setAddManualQuizFormOpen] =
    useState<boolean>(false);
  const [addAIQuizFormOpen, setAddAIQuizFormOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Quizzes
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAddAIQuizFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Quiz by AI
          </button>
          <button
            onClick={() => setAddManualQuizFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Quiz Manually
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader size="size-10 mt-10" />
      ) : (
        <div className="flex gap-6 justify-between mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[60%]">
            {data?.data?.map((quiz: any) => (
              <QuizCard
                key={quiz?._id}
                quiz={quiz}
                selectedQuizData={selectedQuizData}
                setSelectedQuizData={setSelectedQuizData}
              />
            ))}
          </div>

          <QuizDetails selectedQuizData={selectedQuizData} />
        </div>
      )}

      {/* Add manual quiz Form Modal */}
      <AddManualQuizModal
        showForm={addManualQuizFormOpen}
        setShowForm={setAddManualQuizFormOpen}
      />

      {/* Add AI quiz Form Modal */}
      <AddAIQuizModal
        showForm={addAIQuizFormOpen}
        setShowForm={setAddAIQuizFormOpen}
      />
    </div>
  );
};

export default Quiz;
