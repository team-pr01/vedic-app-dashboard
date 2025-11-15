import { icons, Search } from "lucide-react";
import { useMemo, useState } from "react";
import AddProductForm from "../../components/ShopPage/AddProductForm/AddProductForm";
import Categories from "../../components/Categories/Categories";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
} from "../../redux/Features/Product/productApi";
import Loader from "../../components/Shared/Loader/Loader";
import { useGetAllCategoriesQuery } from "../../redux/Features/Categories/ReelCategory/categoriesApi";
import ProductBanner from "../../components/ShopPage/ProductBanner/ProductBanner";

export type TProduct = {
  _id: string;
  imageUrl?: string;
  name: string;
  category: string;
  productLink: string;
  description: string;
  basePrice: string;
  discountedPrice: string;
  currency: string;
  label: string;
  tags: string;
  videoUrl?: string;
  clicks?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const Shop = () => {
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const { Plus, Pencil, Trash2, Package, BarChart } = icons;

  // Get all Ayurveda items
  const { data, isLoading, isFetching } = useGetAllProductsQuery({
    keyword: searchQuery,
    category,
  });

  const { data: categories } = useGetAllCategoriesQuery({});
  const filteredCategories = categories?.data?.filter(
    (category: any) => category.areaName === "product"
  );

  const categoryNames = filteredCategories?.map(
    (category: any) => category?.category
  );

  const allProducts = data?.data?.products || [];

  const {
    data: singleProductData,
    isLoading: isSingleDataLoading,
    isFetching: isSingleDataFetching,
  } = useGetSingleProductQuery(productId);

  const stats = useMemo(
    () => ({
      totalProducts: allProducts?.length || 0,
      totalClicks: allProducts.reduce((acc: any, p: any) => acc + p.clicks, 0),
    }),
    [allProducts]
  );

  const LabelBadge: React.FC<{ label: any | undefined }> = ({ label }) => {
    if (!label) return null;
    const styles: Record<any, string> = {
      "New Product":
        "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
      "Limited Product":
        "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
      "Best Seller":
        "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[label]}`}
      >
        {label}
      </span>
    );
  };

  const [deleteProduct] = useDeleteProductMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDelete = async () => {
    toast.promise(deleteProduct(productId).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Shop Management
      </h2>

      {/* Stats card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-500/20">
            <Package className="w-6 h-6 text-blue-500 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Total Products</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalProducts}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-500/20">
            <BarChart className="w-6 h-6 text-green-500 dark:text-green-300" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Total Clicks</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalClicks.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Table & Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
        {/* Table header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">All Products</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search product by name...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary-500 transition duration-300"
                />
              </div>
            </div>
            {category !== null && (
              <select
                value={category}
                onChange={(e) => setCategory && setCategory(e.target.value)}
                className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary-500 transition duration-300"
              >
                <option value="">All Categories</option>
                {categoryNames?.map((category: any, index: number) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" /> Add category
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setMode("add");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" /> Add Product
            </button>
          </div>
        </div>

          {/* Product table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3 font-semibold">PRODUCT</th>
                <th className="p-3 font-semibold">CATEGORY</th>
                <th className="p-3 font-semibold">PRICE</th>
                <th className="p-3 font-semibold">LABEL</th>
                <th className="p-3 font-semibold text-center">
                  ANALYTICS (Total Clicks)
                </th>
                <th className="p-3 font-semibold text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <Loader size="size-10" />
                  </td>
                </tr>
              ) : allProducts && allProducts.length > 0 ? (
                allProducts.map((product: TProduct) => (
                  <tr
                    key={product._id}
                    className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      {product.category}
                    </td>
                    <td className="p-3 font-mono text-slate-800 dark:text-slate-200">
                      {Number(product.discountedPrice)} {" "}
                      <span className="text-sm line-through text-red-500">
                          {Number(product.basePrice).toFixed(2)}
                      </span>{" "}
                      {product.currency}
                    </td>
                    <td className="p-3">
                      <LabelBadge label={product.label} />
                    </td>
                    <td className="p-3 text-center text-slate-600 dark:text-slate-300 font-mono">
                      {product.clicks}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          onClick={() => {
                            setMode("edit");
                            setProductId(product._id);
                            setShowForm(true);
                          }}
                          className="p-2 text-slate-500 hover:text-green-500"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteModal(true);
                            setProductId(product._id);
                          }}
                          className="p-2 text-slate-500 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <AddProductForm
          setShowForm={setShowForm}
          defaultValues={singleProductData?.data}
          mode={mode}
          isSingleDataLoading={isSingleDataLoading || isSingleDataFetching}
        />
      )}

      {/* Category management */}
      <Categories
        showModal={showCategoryForm}
        setShowModal={setShowCategoryForm}
        areaName="product"
      />

      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <ProductBanner/>
    </div>
  );
};

export default Shop;
