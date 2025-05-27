import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root";
import ErrorPage from "../Pages/ErrorPage";

import Register from "../Pages/Register";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import VideoLectures from "../Pages/VideoLectures";
import Courses from "../Pages/Courses";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/videos",
        element: <VideoLectures></VideoLectures>,
      },
      {
        path: "/courses",
        element: <Courses></Courses>,
      },
    ],
  },
]);
