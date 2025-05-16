import { useState, useCallback } from 'react';
import { firebaseAdmin } from '../lib/firebase-admin';
import toast from 'react-hot-toast';

export function useFirebaseAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleOperation = useCallback(async (operation: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    users: {
      getAll: () => handleOperation(() => firebaseAdmin.users.getAll()),
      update: (userId: string, data: any) => 
        handleOperation(() => firebaseAdmin.users.updateUser(userId, data)),
      delete: (userId: string) => 
        handleOperation(() => firebaseAdmin.users.deleteUser(userId))
    },
    content: {
      getAllPosts: () => handleOperation(() => firebaseAdmin.content.getAllPosts()),
      createPost: (data: any) => 
        handleOperation(() => firebaseAdmin.content.createPost(data)),
      updatePost: (postId: string, data: any) => 
        handleOperation(() => firebaseAdmin.content.updatePost(postId, data)),
      deletePost: (postId: string) => 
        handleOperation(() => firebaseAdmin.content.deletePost(postId))
    },
    media: {
      upload: (file: File, path: string) => 
        handleOperation(() => firebaseAdmin.media.uploadFile(file, path)),
      delete: (path: string) => 
        handleOperation(() => firebaseAdmin.media.deleteFile(path))
    },
    analytics: {
      getUserStats: () => handleOperation(() => firebaseAdmin.analytics.getUserStats()),
      getContentStats: () => handleOperation(() => firebaseAdmin.analytics.getContentStats())
    },
    settings: {
      getAll: () => handleOperation(() => firebaseAdmin.settings.getAppSettings()),
      update: (settingId: string, data: any) => 
        handleOperation(() => firebaseAdmin.settings.updateAppSettings(settingId, data))
    }
  };
}