import React, { useState, useEffect } from 'react';
import { Upload, Image, Video, Trash2 } from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';
import type { HomeContent } from '../types';

export function ContentManager() {
  const [content, setContent] = useState<HomeContent[]>([]);
  const [newContent, setNewContent] = useState({
    type: 'image',
    title: '',
    file: null as File | null,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'homeContent'), (snapshot) => {
      const contentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HomeContent[];
      setContent(contentData);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewContent({ ...newContent, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add null check for file before accessing its properties
    if (!newContent.file) {
      console.error('No file selected');
      return;
    }

    try {
      const storage = getStorage();
      const fileRef = ref(storage, `homeContent/${newContent.file.name}`);
      await uploadBytes(fileRef, newContent.file);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'homeContent'), {
        type: newContent.type,
        url,
        title: newContent.title,
        active: true,
        startDate: newContent.startDate,
        endDate: newContent.endDate
      });

      setNewContent({
        type: 'image',
        title: '',
        file: null,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10)
      });
    } catch (error) {
      console.error('Error uploading content:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content Type
          </label>
          <select
            value={newContent.type}
            onChange={(e) => setNewContent({ ...newContent, type: e.target.value as 'image' | 'video' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={newContent.title}
            onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            File
          </label>
          <input
            type="file"
            accept={newContent.type === 'image' ? 'image/*' : 'video/*'}
            onChange={handleFileChange}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              value={newContent.startDate}
              onChange={(e) => setNewContent({ ...newContent, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              type="date"
              value={newContent.endDate}
              onChange={(e) => setNewContent({ ...newContent, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Content
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 dark:border-gray-700">
            {item.type === 'image' ? (
              <img src={item.url} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-2" />
            ) : (
              <video src={item.url} className="w-full h-48 object-cover rounded-lg mb-2" controls />
            )}
            <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-sm text-gray-500">
              Active: {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
            </p>
            <button
              onClick={() => deleteDoc(doc(db, 'homeContent', item.id))}
              className="mt-2 inline-flex items-center text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}