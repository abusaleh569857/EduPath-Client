import { createBrowserRouter } from "react-router-dom"
import Root from "../Layout/Root"
import ErrorPage from "../Pages/ErrorPage"
import Register from "../Pages/Register"
import Home from "../Pages/Home"
import Login from "../Pages/Login"
import VideoLectures from "../Pages/VideoLectures"
import Courses from "../Pages/Courses"
import CourseDetails from "../Pages/CourseDetails"
import Dashboard from "../Pages/Dashboard"
import Enrollment from "../Pages/Enrollment"
import Payment from "../Pages/Payment"
import PaymentSuccess from "../Pages/PaymentSuccess"
import PaymentFail from "../Pages/PaymentFail"
import Invoice from "../Pages/Invoice"
import CourseContent from "../Pages/CourseContent"
import Profile from "../Pages/Profile"
import AdminDashboard from "../Pages/AdminDashboard"
import AdminUsers from "../Pages/AdminUsers"
import InstructorDashboard from "../Pages/InstructorDashboard"
import CreateCourse from "../Pages/CreateCourse"
import PrivateRoute from "../Components/PrivateRoute"
import AdminRoute from "../Components/AdminRoute"
import InstructorRoute from "../Components/InstructorRoute"
import AboutUs from "../Pages/AboutUs"
import Leaderboard from "../Pages/Leaderboard"
import InstructorCourseContentManager from "../Pages/InstructorCourseContentManager"


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/videos",
        element: <VideoLectures />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/course/:id",
        element: <CourseDetails />,
      },
      {
        path: "/dashboard",
        element: <PrivateRoute>{<Dashboard />}</PrivateRoute>,
      },
      {
        path: "/profile",
        element: <PrivateRoute>{<Profile />}</PrivateRoute>,
      },
      {
        path: "/leaderboard",
        element: <PrivateRoute>{<Leaderboard />}</PrivateRoute>,
      },
      {
        path: "/enroll/:courseId",
        element: <PrivateRoute>{<Enrollment />}</PrivateRoute>,
      },
      {
        path: "/payment/:courseId",
        element: <PrivateRoute>{<Payment />}</PrivateRoute>,
      },
      {
        path: "/payment/success",
        element: <PaymentSuccess />,
      },
      {
        path: "/payment/fail",
        element: <PaymentFail />,
      },
      {
        path: "/invoice/:enrollmentId",
        element: <PrivateRoute>{<Invoice />}</PrivateRoute>,
      },
      {
        path: "/course-content/:courseId",
        element: <PrivateRoute>{<CourseContent />}</PrivateRoute>,
      },

      // Admin Routes
      {
        path: "/admin/dashboard",
        element: <AdminRoute>{<AdminDashboard />}</AdminRoute>,
      },
      {
        path: "/admin/users",
        element: <AdminRoute>{<AdminUsers />}</AdminRoute>,
      },
      // Instructor Routes
      {
        path: "/instructor/dashboard",
        element: <InstructorRoute>{<InstructorDashboard />}</InstructorRoute>,
      },
      {
        path: "/instructor/create-course",
        element: <InstructorRoute>{<CreateCourse />}</InstructorRoute>,
      },
      {
        path: "/instructor/course-content",
        element: <InstructorRoute>{<InstructorCourseContentManager />}</InstructorRoute>,
      }
      
    ],
  },
])
