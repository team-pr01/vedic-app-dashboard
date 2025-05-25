import { Calendar, Clock, Info, LandPlot, MapPin } from "lucide-react";


const TempleDetails = ({selectedTemple} : {selectedTemple: any}) => {
    const handleAddEvent = async (data) => {
    console.log(data);
  };
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="h-64 overflow-hidden">
            {selectedTemple.images && selectedTemple.images.length > 0 ? (
              <img
                src={selectedTemple.images[0]}
                alt={selectedTemple.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <LandPlot className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedTemple.name}
            </h2>

            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
              <MapPin className="h-5 w-5 mr-1" />
              <span>
                {selectedTemple.location.address},{" "}
                {selectedTemple.location.city},{selectedTemple.location.state},{" "}
                {selectedTemple.location.country}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center text-blue-700 dark:text-blue-300 mb-1">
                  <Info className="h-5 w-5 mr-2" />
                  <span className="font-medium">Main Deity</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedTemple.deity}
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center text-purple-700 dark:text-purple-300 mb-1">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="font-medium">Established</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedTemple.establishedYear || "Unknown"}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center text-green-700 dark:text-green-300 mb-1">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">Visiting Hours</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedTemple.visitingHours}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                About
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedTemple.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Contact Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedTemple.contactInfo.phone}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Email:</span>{" "}
                  {selectedTemple.contactInfo.email}
                </p>
                {selectedTemple.contactInfo.website && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Website:</span>{" "}
                    <a
                      href={selectedTemple.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {selectedTemple.contactInfo.website}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Temple Events
              </h3>

              {selectedTemple.events && selectedTemple.events.length > 0 ? (
                <div className="space-y-4">
                  {selectedTemple.events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {event.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No events scheduled.
                </p>
              )}

              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Add New Event
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                      required
                    />
                  </div>

                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Add Event
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Media Gallery
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedTemple.images &&
                  selectedTemple.images.map((image, index) => (
                    <div
                      key={`image-${index}`}
                      className="rounded-lg overflow-hidden h-48"
                    >
                      <img
                        src={image}
                        alt={`${selectedTemple.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                {selectedTemple.videos &&
                  selectedTemple.videos.map((video, index) => (
                    <div
                      key={`video-${index}`}
                      className="rounded-lg overflow-hidden h-48"
                    >
                      <video
                        src={video}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
    );
};

export default TempleDetails;