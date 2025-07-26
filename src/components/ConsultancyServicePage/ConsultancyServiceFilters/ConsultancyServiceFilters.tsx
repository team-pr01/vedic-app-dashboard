import { Search } from "lucide-react";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Categories/ReelCategory/categoriesApi";

type TConsultancyServiceFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCategory: (status: string) => void;
  category : string
};

const ConsultancyServiceFilters: React.FC<TConsultancyServiceFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  setCategory,
  category,
}) => {
  const { data: categories, isLoading } = useGetAllCategoriesQuery({});
    const filteredCategories = categories?.data?.filter(
      (category: any) => category.areaName === "consultancyService"
    );

    const categoryNames = filteredCategories?.map(
    (category: any) => category?.category
  );
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary-500 transition duration-300"
          />
        </div>
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      >
        <option value="">All Categories</option>
        {categoryNames?.map((category: any, index: number) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ConsultancyServiceFilters;
