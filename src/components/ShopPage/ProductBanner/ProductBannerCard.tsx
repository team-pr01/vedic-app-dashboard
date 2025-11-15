import toast from "react-hot-toast";
import { useDeleteProductBannerMutation } from "../../../redux/Features/ProductBanner/productBannerApi";
import { Trash2 } from "lucide-react";

const ProductBannerCard = ({ data }: { data: any }) => {
  const { _id, title, description, imageUrl, link } = data || {};

  const handleViewNow = () => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const [deleteProductBanner] = useDeleteProductBannerMutation();

  const handleDeleteProductBanner = async (id: string) => {
    console.log(id);
    if (!window.confirm("Are you sure you want to delete?")) return;

    toast.promise(deleteProductBanner(id).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };

  return (
    <div className="flex max-w-2xl rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 relative">
      {/* Delete Icon */}
      <button
        onClick={() => handleDeleteProductBanner(_id)}
        className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-10"
        aria-label="Delete banner"
      >
        <Trash2 size={18} />
      </button>

      {/* Image Section */}
      <div className="w-1/2 h-[200px]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Button */}
        <button
          className="w-fit bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleViewNow}
          aria-label={`View ${title}`}
        >
          View Now
        </button>
      </div>
    </div>
  );
};

export default ProductBannerCard;
