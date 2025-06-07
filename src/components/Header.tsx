import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, useCurrentUser } from "../redux/Features/Auth/authSlice";
import { useNavigate } from "react-router-dom";

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/");
  };

  const user = useSelector(useCurrentUser) as any;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 font-Inter">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center flex-1">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div> */}

          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-medium text-neutral-700 dark:text-gray-400">
              Welcome back,{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {user?.name}
              </span>
            </h1>
            <div className="text-neutral-700 dark:text-gray-200 capitalize bg-green-100/50 w-fit px-3 py-1 rounded-lg text-sm">
              {user?.role}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button> */}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="size-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
