import React, { Dispatch, SetStateAction, useState } from "react";
import { useDeleteCourseMutation } from "../../../redux/Features/Course/courseApi";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../DeleteConfirmationModal/DeleteConfirmationModal";
import { Pencil, Trash2 } from "lucide-react";

type TCourseCardProps = {
  course: any;
  setCourseId: (id: string) => void;
  setMode: Dispatch<SetStateAction<"add" | "edit">>;
  setShowForm: (show: boolean) => void;
};

const CourseCard: React.FC<TCourseCardProps> = ({
  course,
  setCourseId,
  setMode,
  setShowForm,
}) => {
  const handleEdit = () => {
    setCourseId(course?._id);
    setMode("edit");
    setShowForm(true);
  };

  const [deleteCourse] = useDeleteCourseMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDelete = async () => {
    toast.promise(deleteCourse(course?._id).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };
  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl shadow-md bg-white  hover:shadow-lg transition">
        <img
          src={course?.imageUrl}
          alt={course?.name}
          className="w-full h-72 rounded-t-2xl"
        />
        <div className="p-4">
            <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {course?.name}
          </h2>
          <p className="text-sm text-[#fa5a5a] font-medium">
            {course?.category}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleEdit}
            className="text-blue-500 hover:text-blue-600"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 hover:text-red-600"
            type="button"
          >
            <Trash2 size={18} />
          </button>
        </div>
        </div>
      </div>    
      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default CourseCard;
