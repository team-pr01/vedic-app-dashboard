import { useForm } from "react-hook-form";
import { useAddQuizByAIMutation } from "../../../redux/Features/Quiz/quizApi";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import { useState } from "react";

type TAddAIQuizModalProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddAIQuizModal: React.FC<TAddAIQuizModalProps> = ({
  showForm,
  setShowForm,
}) => {
  const [addQuizByAI, { isLoading }] = useAddQuizByAIMutation();
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  const handleAddQuizByAI = async (data: any) => {
    try {
      const response = await addQuizByAI(data).unwrap();

      if (response?.success) {
        toast.success("Quiz added successfully!");
        setGeneratedQuiz(response?.data?.questions);
      }
    } catch (err) {
      console.error("Error adding quiz:", err);
    }
  };

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[700px] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleAddQuizByAI)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Quiz
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                  setGeneratedQuiz(null);
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Quiz Title */}
            <TextInput
              label="Title"
              placeholder="Enter quiz title/topic"
              {...register("title", { required: "Title is required" })}
              error={errors.title}
              isDisabled={!!generatedQuiz} // disable input once quiz is generated
            />

            {/* Show generated quiz if available */}
            {generatedQuiz?.length > 0 && (
              <div className="mt-6 space-y-6">
                {generatedQuiz?.map((q: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                      {idx + 1}. {q.question}
                    </h4>
                    <ul className="space-y-2">
                      {q.options.map((opt: string, i: number) => (
                        <li
                          key={i}
                          className={`px-3 py-2 rounded-md text-sm ${
                            q.correctAnswer === i + 1
                              ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-white font-semibold"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                          }`}
                        >
                          {i + 1}. {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Submit / Cancel */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                  setGeneratedQuiz(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <SubmitButton
                isLoading={isLoading}
                isDisabled={!!generatedQuiz}
              />
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddAIQuizModal;
