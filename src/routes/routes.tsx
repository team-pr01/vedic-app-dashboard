import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Signin from "../pages/Signin";
import Emergency from "../pages/Emergency/Emergency";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Signin />,
  },
  {
    path: "dashboard",
    element: <Layout />,
    // errorElement: <NotFound />,
    children: [
      {
        path: "emergency",
        element: <Emergency />,
      },
    ],
  },
  
]);
