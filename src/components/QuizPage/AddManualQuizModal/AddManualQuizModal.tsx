import { useForm, useFieldArray } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import toast from "react-hot-toast";
import { useAddQuizManuallyMutation } from "../../../redux/Features/Quiz/quizApi";

type TQuestion = {
  question: string;
  options: string[];
  correctAnswer: number | string;
};

type TFormValues = {
  title: string;
  questions: TQuestion[];
};

type TAddManualQuizModalProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddManualQuizModal = ({
  showForm,
  setShowForm,
}: TAddManualQuizModalProps) => {
  const [addQuizManually, { isLoading }] = useAddQuizManuallyMutation();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TFormValues>({
    defaultValues: {
      title: "",
      questions: [
        { question: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const handleAddQuiz = async (data: TFormValues) => {
    try {
      const response = await addQuizManually(data).unwrap();
      console.log(response);
      if (response?.success) {
        toast.success("Quiz added successfully!");
        setShowForm(false);
        reset();
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
            onSubmit={handleSubmit(handleAddQuiz)}
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
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Quiz Title */}
            <TextInput
              label="Title"
              placeholder="Enter quiz title"
              {...register("title", { required: "Title is required" })}
              error={errors.title}
            />

            {/* Questions */}
            <div>
              <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                Questions
              </h4>
              {fields.map((field, qIndex) => (
                <div
                  key={field.id}
                  className="border p-4 mb-4 rounded-md bg-gray-50 dark:bg-gray-700"
                >
                  {/* Question Text */}
                  <TextInput
                    label={`Question ${qIndex + 1}`}
                    placeholder="Enter question"
                    {...register(`questions.${qIndex}.question`, {
                      required: "Question is required",
                    })}
                    error={errors.questions?.[qIndex]?.question}
                  />

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {Array(4)
                      .fill(null)
                      .map((_, optIndex) => (
                        <TextInput
                          key={optIndex}
                          label={`Option ${optIndex + 1}`}
                          placeholder={`Enter option ${optIndex + 1}`}
                          {...register(
                            `questions.${qIndex}.options.${optIndex}`,
                            {
                              required: "Option is required",
                            }
                          )}
                          error={
                            errors.questions?.[qIndex]?.options?.[optIndex]
                          }
                        />
                      ))}
                  </div>

                  {/* Correct Answer */}
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Correct Answer
                    </label>
                    <select
                      {...register(`questions.${qIndex}.correctAnswer`, {
                        required: "Correct answer is required",
                        setValueAs: (v) => Number(v), // ensures it's number, not string
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white"
                    >
                      <option value="">Select Correct Answer</option>
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          Option {num}
                        </option>
                      ))}
                    </select>
                    {errors.questions?.[qIndex]?.correctAnswer && (
                      <p className="text-red-500 text-sm">
                        {errors.questions[qIndex]?.correctAnswer?.message}
                      </p>
                    )}
                  </div>

                  {/* Remove Question Button */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(qIndex)}
                      className="mt-3 px-3 py-1 bg-red-500 text-white text-sm rounded-md"
                    >
                      Remove Question
                    </button>
                  )}
                </div>
              ))}

              {/* Add Question Button */}
              <button
                type="button"
                onClick={() =>
                  append({
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: "",
                  })
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                + Add Question
              </button>
            </div>

            {/* Submit / Cancel */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <SubmitButton isLoading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddManualQuizModal;
