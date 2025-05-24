const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <svg
        className="animate-spin size-10 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          className="opacity-75"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="60"
          strokeDashoffset="20"
        />
      </svg>
    </div>
  );
};

export default Loader;
