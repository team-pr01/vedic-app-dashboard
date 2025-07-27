import { Bell, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, useCurrentUser } from "../redux/Features/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import moment from "moment"; // Optional: for date formatting
import { useGetAllNotificationsQuery } from "../redux/Features/Notification/notificationApi";

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(useCurrentUser) as any;
  const [unreadCount, setUnreadCount] = useState(0);

  const { data } = useGetAllNotificationsQuery({});

  const [notifications, setNotifications] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("new-notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("new-notification");
      socket.off("connect");
    };
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (data?.data) {
      // Merge backend notifications with real-time ones, newest first
      const combined = [...notifications, ...data.data];

      // Optional: Deduplicate if needed by filtering based on createdAt + message or _id
      const unique = Array.from(
        new Map(
          combined.map((n) => [n._id || n.createdAt + n.message, n])
        ).values()
      );

      // Sort descending by createdAt
      const sorted = unique.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(sorted);
    }
  }, [data?.data]);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 font-Inter">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
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

          <div
            className="relative flex items-center space-x-4"
            ref={dropdownRef}
          >
            {/* Bell Icon with Badge */}
            <button
              onClick={() => {
                setOpenDropdown(!openDropdown);
                if (!openDropdown) {
                  setUnreadCount(0); // ✅ Reset unread count when opening dropdown
                }
              }}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {openDropdown && (
              <div className="absolute right-0 top-12 w-96 max-h-[400px] overflow-y-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg border dark:border-gray-700 z-50">
                <div className="p-4 border-b dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200">
                  Notifications
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                    No notifications yet.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification, index) => (
                      <li
                        key={index}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleExpand(index)}
                        >
                          <div className="font-medium text-gray-800 dark:text-gray-100">
                            {notification.title}{" "}
                            <span className="text-blue-500 text-xs">
                              (
                              {moment(notification.createdAt).format(
                                "MMMM Do YYYY, h:mm A"
                              )}
                              )
                            </span>
                          </div>
                          {expandedIndex === index ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </div>

                        {expandedIndex === index && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <div>
                              <span className="font-semibold">Message:</span>{" "}
                              {notification.message}
                            </div>
                            <div>
                              <span className="font-semibold">
                                Received At:
                              </span>{" "}
                              {moment(notification.createdAt).format(
                                "MMMM Do YYYY, h:mm A"
                              )}
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Logout */}
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
