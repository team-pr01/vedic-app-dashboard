import { Plus } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  buttonText: string;
  icon?: ReactNode;
  onClick: () => void;
  setShowCategoryForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const PageHeader = ({
  title,
  buttonText,
  icon,
  onClick,
  setShowCategoryForm,
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="flex items-center gap-4">
        <button
        onClick={() => {
          setShowCategoryForm(true);
        }}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Manage Categories
      </button>
      <button
        onClick={onClick}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {buttonText}
      </button>
      </div>
    </div>
  );
};

export default PageHeader;
