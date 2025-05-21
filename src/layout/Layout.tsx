import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Dashboard } from '../components/Dashboard';
import { Auth } from '../components/Auth';
const Layout = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
      const [activeSection, setActiveSection] = useState('dashboard');
      const [session, setSession] = useState<null | any>(null);
      const [showAuth, setShowAuth] = useState(false);
    
      useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
        });
    
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
    
        // Check system preference for dark mode
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setIsDarkMode(true);
          document.documentElement.classList.add('dark');
        }
    
        return () => subscription.unsubscribe();
      }, []);
    
      const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
      };
    return (
        <div className={`flex h-screen ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      <Sidebar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Header session={session} onAuthClick={() => setShowAuth(true)} />
        <Dashboard activeSection={activeSection} />
      </div>
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <Auth onSuccess={() => setShowAuth(false)} onClose={() => setShowAuth(false)} />
          </div>
        </div>
      )}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#374151' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
          },
        }}
      />
    </div>
    );
};

export default Layout;