import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Emergency from "../pages/Emergency/Emergency";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import Users from "../pages/Users/Users";
import Login from "../pages/Login/Login";
import Reels from "../pages/Reels/Reels";
import Yoga from "../pages/Yoga/Yoga";
import Vastu from "../pages/Vastu/Vastu";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "dashboard",
    element: <Layout />,
    // errorElement: <NotFound />,
    children: [
      {
        path: "home",
        element: <Dashboard />,
      },
      {
        path: "emergency",
        element: <Emergency />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "reels",
        element: <Reels />,
      },
      {
        path: "yoga",
        element: <Yoga />,
      },
      {
        path: "vastu",
        element: <Vastu />,
      },
    ],
  },
]);
