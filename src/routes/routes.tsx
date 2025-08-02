import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Emergency from "../pages/Emergency/Emergency";
import Users from "../pages/Users/Users";
import Login from "../pages/Login/Login";
import Reels from "../pages/Reels/Reels";
import Yoga from "../pages/Yoga/Yoga";
import Vastu from "../pages/Vastu/Vastu";
import TempleManagement from "../pages/TempleManagement/TempleManagement";
import Organizations from "../pages/Organizations/Organizations";
// import ReligiousTexts from "../pages/ReligiousTexts/ReligiousTexts";
import News from "../pages/News/News";
import Notification from "../pages/Notification/Notification";
import Popups from "../pages/Popups/Popups";
import Dashboard from "../pages/Dashboard/Dashboard";
import ContentManagement from "../pages/ContentManagement/ContentManagement";
import { ProtectedRoute } from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
// import APIKey from "../pages/APIKey/APIKey";
import NotFound from "../pages/NotFound/NotFound";
import Books from "../pages/Books/Books";
import ConsultancyService from "../pages/ConsultancyService/ConsultancyService";
import APIKey from "../pages/APIKey/APIKey";
import Course from "../pages/Course/Course";
import Recipe from "../pages/Recipe/Recipe";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "dashboard",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
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
      {
        path: "temple-management",
        element: <TempleManagement />,
      },
      {
        path: "organizations",
        element: <Organizations />,
      },
      {
        path: "religious-texts",
        element: <Books />,
      },
      // {
      //   path: "religious-texts",
      //   element: <ReligiousTexts />,
      // },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "notifications",
        element: <Notification />,
      },
      {
        path: "popups",
        element: <Popups />,
      },
      {
        path: "content",
        element: <ContentManagement />,
      },
      {
        path: "consultancy-service",
        element: <ConsultancyService/>,
      },
      {
        path: "recipe",
        element: <Recipe/>,
      },
      {
        path: "api-keys",
        element: <APIKey />,
      },
      {
        path: "course",
        element: <Course />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
