import { Search, Bell, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/Features/Auth/authSlice';
import { useNavigate } from 'react-router-dom';


export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 const handleLogout = async () => {
  dispatch(logout());
  navigate("/");
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <LogOut className="h-6 w-6" />
                </button> */}

                <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="size-5" />
                Logout
              </button>
            
            {/* {session ? (
              <>
                
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {session.user.email}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Admin</div>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </button>
            )} */}
          </div>
        </div>
      </div>
    </header>
  );
}