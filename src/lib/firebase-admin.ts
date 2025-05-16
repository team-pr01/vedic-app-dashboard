import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const firebaseAdmin = {
  // User Management
  users: {
    async getAll() {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async updateUser(userId: string, data: any) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, data);
    },

    async deleteUser(userId: string) {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    }
  },

  // Content Management
  content: {
    async getAllPosts() {
      const postsRef = collection(db, 'posts');
      const snapshot = await getDocs(postsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async createPost(data: any) {
      const postsRef = collection(db, 'posts');
      return await addDoc(postsRef, {
        ...data,
        createdAt: new Date().toISOString()
      });
    },

    async updatePost(postId: string, data: any) {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    },

    async deletePost(postId: string) {
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);
    }
  },

  // Media Management
  media: {
    async uploadFile(file: File, path: string) {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    },

    async deleteFile(path: string) {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    }
  },

  // Analytics
  analytics: {
    async getUserStats() {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return {
        totalUsers: snapshot.size,
        // Add more analytics as needed
      };
    },

    async getContentStats() {
      const postsRef = collection(db, 'posts');
      const snapshot = await getDocs(postsRef);
      return {
        totalPosts: snapshot.size,
        // Add more analytics as needed
      };
    }
  },

  // Settings Management
  settings: {
    async getAppSettings() {
      const settingsRef = collection(db, 'settings');
      const snapshot = await getDocs(settingsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async updateAppSettings(settingId: string, data: any) {
      const settingRef = doc(db, 'settings', settingId);
      await updateDoc(settingRef, data);
    }
  }
};