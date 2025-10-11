import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../Home/Home";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Login from "../Pages/Authtincation/Login/Login";

import Signup from "../Pages/Authtincation/Signup/Signup";
import AddBook from "../Pages/Dashboard/Page/AddBook/AddBook";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "signup",
        element: <Signup></Signup>,
      },
    ],
  },

  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children:[
        {
            path:'addbook',
            element:<AddBook></AddBook>
        }
    ]
  },
]);
