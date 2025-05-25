import { Info, LandPlot, MapPin } from "lucide-react";

type TTempleCardProps = {
    temple: any;
    setSelectedTemple: (temple: any) => void;
    setActiveTab: (tab: string) => void;
}
const TempleCard: React.FC<TTempleCardProps> = ({temple, setSelectedTemple, setActiveTab}) => {
    return (
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="h-48 overflow-hidden">
                {temple.images && temple.images.length > 0 ? (
                  <img 
                    src={temple.images[0]} 
                    alt={temple.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <LandPlot className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{temple.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {temple.location.city}, {temple.location.country}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <Info className="h-4 w-4 mr-1" />
                  {temple.deity}
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTemple(temple);
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