import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Auth } from "../components/Auth";
import { Outlet } from "react-router-dom";
const Layout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`flex h-screen ${
        isDarkMode ? "dark" : ""
      } bg-gray-50 dark:bg-gray-900`}
    >
      <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="p-6">
          <Outlet />
        </div>
        {/* <Dashboard activeSection={activeSection} /> */}
      </div>
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <Auth
              onSuccess={() => setShowAuth(false)}
              onClose={() => setShowAuth(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
