import { Info, LandPlot, MapPin } from "lucide-react";

type TTempleCardProps = {
    temple: any;
    setActiveTab: (tab: string) => void;
    setTempleId: (templeId: string) => void;
}
const TempleCard: React.FC<TTempleCardProps> = ({temple, setActiveTab, setTempleId}) => {
    return (
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                    src={temple?.imageUrl} 
                    alt={temple.name} 
                    className="w-full h-full object-cover"
                  />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{temple.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {temple?.city}, {temple?.country}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <Info className="h-4 w-4 mr-1" />
                  {temple.mainDeity}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-2">
                  {temple.description}
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      setTempleId(temple?._id);
                      setActiveTab('details');
                    }}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm"
                  >
                    View Details
                  </button>
                  <button
                    className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
    );
};

export default TempleCard;