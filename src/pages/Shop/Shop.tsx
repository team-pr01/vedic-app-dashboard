import { icons } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import AddProductForm from "../../components/ShopPage/AddProductForm/AddProductForm";

const Shop = () => {
const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");



  const { Plus, Pencil, Trash2, Search, Package, BarChart, DollarSign } = icons;
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modal, setModal] = useState<{
    type: "edit" | "delete";
    data: any | null;
  }>({ type: null, data: null });

  const stats = useMemo(
    () => ({
      totalProducts: products.length,
      totalClicks: products.reduce((acc, p) => acc + p.clicks, 0),
      totalPurchases: products.reduce((acc, p) => acc + p.purchases, 0),
    }),
    [products]
  );

  const handleSaveProduct = (productData: any) => {
    if (products.some((p) => p.id === productData.id)) {
      setProducts((prods) =>
        prods.map((p) => (p.id === productData.id ? productData : p))
      );
      toast.success("Product updated!");
    } else {
      setProducts((prods) => [productData, ...prods]);
      toast.success("Product added!");
    }
    setModal({ type: null, data: null });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts((prods) => prods.filter((p) => p.id !== id));
    toast.success("Product deleted!");
    setModal({ type: null, data: null });
  };

  const getCategoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name || "N/A";

  const LabelBadge: React.FC<{ label: any["label"] }> = ({ label }) => {
    if (!label) return null;
    const styles = {
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
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Shop Management
      </h2>

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
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-500/20">
            <DollarSign className="w-6 h-6 text-amber-500 dark:text-amber-300" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              Total Purchases
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalPurchases.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">All Products</h3>
          <button
            onClick={() => {setShowForm(true); setMode("add");}}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3 font-semibold">PRODUCT</th>
                <th className="p-3 font-semibold">CATEGORY</th>
                <th className="p-3 font-semibold">PRICE</th>
                <th className="p-3 font-semibold">STATUS</th>
                <th className="p-3 font-semibold text-center">
                  ANALYTICS (C/P)
                </th>
                <th className="p-3 font-semibold text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
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
                    {getCategoryName(product.categoryId)}
                  </td>
                  <td className="p-3 font-mono text-slate-800 dark:text-slate-200">
                    {product.price.toFixed(2)} {product.currency}
                  </td>
                  <td className="p-3">
                    <LabelBadge label={product.label} />
                  </td>
                  <td className="p-3 text-center text-slate-600 dark:text-slate-300 font-mono">
                    {product.clicks} / {product.purchases}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        onClick={() =>
                          setModal({ type: "edit", data: product })
                        }
                        className="p-2 text-slate-500 hover:text-green-500"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setModal({ type: "delete", data: product })
                        }
                        className="p-2 text-slate-500 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* {modal.type === 'edit' && <ProductModal product={modal.data} categories={categories} onSave={handleSaveProduct} onClose={() => setModal({type: null, data: null})} />}
            {modal.type === 'delete' && modal.data && (
                <ModalWrapper title="Confirm Deletion" onClose={() => setModal({ type: null, data: null })} size="max-w-md">
                    <div className="p-6 text-slate-600 dark:text-slate-300">Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{modal.data.name}</strong>?</div>
                    <div className="p-4 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                        <button onClick={() => setModal({ type: null, data: null })} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                        <button onClick={() => handleDeleteProduct(modal.data!.id)} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                </ModalWrapper>
            )} */}

      {showForm && (
        <AddProductForm
          setShowForm={setShowForm}
        //   defaultValues={singleAyurvedaData?.data}
          mode={mode}
        //   isSingleDataLoading={isSingleDataLoading || isSingleDataFetching}
        />
      )}
    </div>
  );
};

export default Shop;
