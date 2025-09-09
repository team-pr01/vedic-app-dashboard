import { Plus } from "lucide-react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { useState } from "react";
import Categories from "../../components/Categories/Categories";
import {
  useGetAlCoursesQuery,
  useGetSingleCourseQuery,
} from "../../redux/Features/Course/courseApi";
import CourseCard from "../../components/CoursePage/CourseCard/CourseCard";
import AddCourseForm from "../../components/CoursePage/AddCourseForm/AddCourseForm";
import Loader from "../../components/Shared/Loader/Loader";
import Filters from "../../components/Reusable/Filters/Filters";

export type TCourse = {
  _id: string;
  imageUrl?: string;
  name: string;
  url: string;
  duration: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Course = () => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  //   Get all Courses
  const { data, isLoading, isFetching } = useGetAlCoursesQuery({
    keyword: searchQuery,
    category,
  });

  const {
    data: singleCourse,
    isLoading: isSingleDataLoading,
    isFetching: isSingleDataFetching,
  } = useGetSingleCourseQuery(courseId);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Courses"
        buttonText="Add Course"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setMode && setMode("add");
          setShowForm(true);
        }}
        setShowCategoryForm={setShowCategoryForm}
      />

      {/* Filters and Search */}
      <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setCategory={setCategory}
        category={category}
        fieldName="course"
      />

      {/* Organization List */}
      {isLoading || isFetching ? (
        <Loader size="size-10" />
      ) : data?.data?.length < 1 ? (
        <h1 className="text-center text-xl font-semibold text-gray-600">
          No Data Found
        </h1>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.data?.map((course: TCourse) => (
            <CourseCard
              key={course?._id}
              course={course}
              setCourseId={setCourseId}
              setMode={setMode}
              setShowForm={setShowForm}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddCourseForm
          setShowForm={setShowForm}
          defaultValues={singleCourse?.data}
          mode={mode}
          isSingleDataLoading={isSingleDataLoading || isSingleDataFetching}
        />
      )}

      {/* Category management */}
      <Categories
        showModal={showCategoryForm}
        setShowModal={setShowCategoryForm}
        areaName="course"
      />
    </div>
  );
};

export default Course;
