import { Plus } from "lucide-react";
import { useGetAllProductBannersQuery } from "../../../redux/Features/ProductBanner/productBannerApi";
import ProductBannerCard from "./ProductBannerCard";
import { useState } from "react";
import AddProductBannerForm from "./AddProductBannerForm";

const ProductBanner = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const { data } = useGetAllProductBannersQuery({});
  console.log(data);
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Product Banner Management
        </h2>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        {data?.data?.map((banner: any) => (
          <ProductBannerCard key={banner?._id} data={banner} />
        ))}
      </div>

      {showForm && <AddProductBannerForm setShowForm={setShowForm} />}
    </div>
  );
};

export default ProductBanner;
