
const QuizDetails = ({selectedQuizData} : any) => {
    return (
        <div className="w-[40%] h-full max-h-[700px] overflow-y-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {selectedQuizData ? (
              <>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedQuizData?.title}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {selectedQuizData?.questions?.length || 0} questions
                </p>

                <div className="flex flex-col gap-4">
                  {selectedQuizData?.questions?.length > 0 && (
                    <div className="mt-6 space-y-6">
                      {selectedQuizData?.questions?.map(
                        (q: any, idx: number) => (
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
                        )
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Please select a quiz to view details
              </p>
            )}
          </div>
    );
};

export default QuizDetails;