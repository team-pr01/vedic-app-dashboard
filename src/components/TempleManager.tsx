import React, { useState, useEffect } from 'react';
import { Upload, Image, Video, Trash2, MapPin, Calendar, Info } from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';

interface Temple {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  images: string[];
  videos?: string[];
  establishedYear?: number;
  deity: string;
  events: {
    id: string;
    name: string;
    date: string;
    description: string;
  }[];
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  visitingHours: string;
  createdAt: string;
  updatedAt: string;
}

export function TempleManager() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [newTemple, setNewTemple] = useState({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
    },
    deity: '',
    establishedYear: new Date().getFullYear(),
    contactInfo: {
      phone: '',
      email: '',
      website: '',
    },
    visitingHours: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'temples'), (snapshot) => {
      const templeData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Temple[];
      setTemples(templeData);
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const storage = getStorage();
      let imageUrls: string[] = [];
      let videoUrls: string[] = [];

      if (selectedImage) {
        const imageRef = ref(storage, `temples/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        const imageUrl = await getDownloadURL(imageRef);
        imageUrls.push(imageUrl);
      }

      if (selectedVideo) {
        const videoRef = ref(storage, `temples/${selectedVideo.name}`);
        await uploadBytes(videoRef, selectedVideo);
        const videoUrl = await getDownloadURL(videoRef);
        videoUrls.push(videoUrl);
      }

      await addDoc(collection(db, 'temples'), {
        ...newTemple,
        images: imageUrls,
        videos: videoUrls,
        events: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setNewTemple({
        name: '',
        description: '',
        location: {
          address: '',
          city: '',
          state: '',
          country: '',
        },
        deity: '',
        establishedYear: new Date().getFullYear(),
        contactInfo: {
          phone: '',
          email: '',
          website: '',
        },
        visitingHours: '',
      });
      setSelectedImage(null);
      setSelectedVideo(null);
      setActiveTab('list');
    } catch (error) {
      console.error('Error adding temple:', error);
    }
  };

  const handleAddEvent = async () => {
    if (!selectedTemple) return;

    try {
      const templeRef = doc(db, 'temples', selectedTemple.id);
      const updatedEvents = [
        ...selectedTemple.events,
        {
          id: Date.now().toString(),
          ...newEvent
        }
      ];

      await updateDoc(templeRef, {
        events: updatedEvents,
        updatedAt: new Date().toISOString()
      });

      setNewEvent({
        name: '',
        date: new Date().toISOString().slice(0, 10),
        description: '',
      });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleDeleteTemple = async (templeId: string) => {
    if (window.confirm('Are you sure you want to delete this temple?')) {
      try {
        await deleteDoc(doc(db, 'temples', templeId));
      } catch (error) {
        console.error('Error deleting temple:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          Temple List
        </button>
        <button
          onClick={() => {
            setActiveTab('add');
            setSelectedTemple(null);
          }}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'add'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          Add New Temple
        </button>
        {selectedTemple && (
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'details'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Temple Details
          </button>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {temples.map((temple) => (
            <div key={temple.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
                    onClick={() => handleDeleteTemple(temple.id)}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Temple</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temple Name
              </label>
              <input
                type="text"
                value={newTemple.name}
                onChange={(e) => setNewTemple({ ...newTemple, name: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Main Deity
              </label>
              <input
                type="text"
                value={newTemple.deity}
                onChange={(e) => setNewTemple({ ...newTemple, deity: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newTemple.description}
              onChange={(e) => setNewTemple({ ...newTemple, description: e.target.value })}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                value={newTemple.location.address}
                onChange={(e) => setNewTemple({ 
                  ...newTemple, 
                  location: { ...newTemple.location, address: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                value={newTemple.location.city}
                onChange={(e) => setNewTemple({ 
                  ...newTemple, 
                  location: { ...newTemple.location, city: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State/Province
              </label>
              <input
                type="text"
                value={newTemple.location.state}
                onChange={(e) => setNewTemple({ 
                  ...newTemple, 
                  location: { ...newTemple.location, state: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value={newTemple.location.country}
                onChange={(e) => setNewTemple({ 
                  ...newTemple, 
                  location: { ...newTemple.location, country: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Established Year
              </label>
              <input
                type="number"
                value={newTemple.establishedYear}
                onChange={(e) => setNewTemple({ 
                  ...newTemple, 
                  establishedYear: parseInt(e.target.value) 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Visiting Hours
              </label>
              <input
                type="text"
                value={newTemple.visitingHours}
                onChange={(e) => setNewTemple({ ...newTemple, visitingHours: e.target.value })}
                placeholder="e.g. 6:00 AM - 9:00 PM"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={newTemple.contactInfo.phone}
                onChange={(e) => setNewTemple({ 
                  ...newTemple, 
                  contactInfo: { ...newTemple.contactInfo, phone: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newTemple.contactInfo.email}
                onChange={(e) => setNewTemple({ 
                  ...newTemple, 
                  contactInfo: { ...newTemple.contactInfo, email: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <input
                type="url"
                value={newTemple.contactInfo.website}
                onChange={(e) => setNewTemple({ 
                  ...newTemple, 
                  contactInfo: { ...newTemple.contactInfo, website: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temple Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temple Video (optional)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Temple
            </button>
          </div>
        </form>
      )}

      {activeTab === 'details' && selectedTemple && (
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedTemple.name}</h2>
            
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
              <MapPin className="h-5 w-5 mr-1" />
              <span>
                {selectedTemple.location.address}, {selectedTemple.location.city}, 
                {selectedTemple.location.state}, {selectedTemple.location.country}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center text-blue-700 dark:text-blue-300 mb-1">
                  <Info className="h-5 w-5 mr-2" />
                  <span className="font-medium">Main Deity</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">{selectedTemple.deity}</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center text-purple-700 dark:text-purple-300 mb-1">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="font-medium">Established</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">{selectedTemple.establishedYear || 'Unknown'}</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center text-green-700 dark:text-green-300 mb-1">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">Visiting Hours</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">{selectedTemple.visitingHours}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h3>
              <p className="text-gray-700 dark:text-gray-300">{selectedTemple.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h3>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Phone:</span> {selectedTemple.contactInfo.phone}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Email:</span> {selectedTemple.contactInfo.email}
                </p>
                {selectedTemple.contactInfo.website && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Website:</span>{' '}
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Temple Events</h3>
              
              {selectedTemple.events && selectedTemple.events.length > 0 ? (
                <div className="space-y-4">
                  {selectedTemple.events.map((event) => (
                    <div key={event.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white">{event.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No events scheduled.</p>
              )}
              
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Add New Event</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Name
                    </label>
                    <input
                      type="text"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
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
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      rows={2}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                      required
                    />
                  </div>
                  
                  <button
                    onClick={handleAddEvent}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Add Event
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Media Gallery</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedTemple.images && selectedTemple.images.map((image, index) => (
                  <div key={`image-${index}`} className="rounded-lg overflow-hidden h-48">
                    <img src={image} alt={`${selectedTemple.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                
                {selectedTemple.videos && selectedTemple.videos.map((video, index) => (
                  <div key={`video-${index}`} className="rounded-lg overflow-hidden h-48">
                    <video src={video} controls className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}