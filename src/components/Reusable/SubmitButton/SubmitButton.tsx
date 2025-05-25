import Loader from "../../Shared/Loader/Loader";

const SubmitButton = ({isLoading} : {isLoading: boolean}) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader size="size-4" variant="secondary" />
          <p>Please wait...</p>
        </div>
      ) : (
        "Submit"
      )}
    </button>
  );
};

export default SubmitButton;
