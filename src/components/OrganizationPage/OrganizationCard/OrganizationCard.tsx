import { Edit2, Globe, MapPin, Phone, Trash2 } from "lucide-react";

const OrganizationCard = ({org} : {org: any}) => {
    return (
         <div
            key={org.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {org.image_url && (
              <img
                src={org.image_url}
                alt={org.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {org.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1">
                    {org.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {org.description}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {org.address.city}, {org.address.country}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  {org.contact.phone}
                </div>
                {org.contact.website && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Globe className="h-4 w-4 mr-2" />
                    <a
                      href={org.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Courses Offered:
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {org.courses_offered.map((course:any, index:number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
        </div>
    );
};

export default OrganizationCard;