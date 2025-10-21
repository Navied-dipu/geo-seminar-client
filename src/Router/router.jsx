import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../Home/Home";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Login from "../Pages/Authtincation/Login/Login";

import Signup from "../Pages/Authtincation/Signup/Signup";
import AddBook from "../Pages/Dashboard/Page/AddBook/AddBook";
import PrivetRouts from "./PrivetRoutes";
import BorrowBook from "../Pages/Dashboard/Page/BorrowBook/BorrowBook";
import MyBorrowedBooks from "../Pages/Dashboard/User/MyBorrowedBook/MyborrowedBooks";
import ReturnBook from "../Pages/Dashboard/Page/ReturnBook/ReturnBook";
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
    element: (
      <PrivetRouts>
        <Dashboard></Dashboard>
      </PrivetRouts>
    ),
    children: [
      {
        path: "addbook",
        element: <AddBook></AddBook>,
      },
      {
        path: "borrowbook",
        element: <BorrowBook></BorrowBook>,
      },
      {
        path:'myborrowedbook',
        element:<MyBorrowedBooks></MyBorrowedBooks>
      },
      {
        path:'returnbook',
        element:<ReturnBook></ReturnBook>
      }
    ],
  },
]);
