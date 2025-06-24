"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import axios from "axios"
import { AuthContext } from "../Provider/AuthProvider"

const InstructorDashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0,
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstructorData()
  }, [])

  const fetchInstructorData = async () => {
    try {
      const token = localStorage.getItem("token")
      const [statsRes, coursesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/instructor/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/instructor/courses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      setStats(statsRes.data)
      setCourses(coursesRes.data)
    } catch (error) {
      console.error("Error fetching instructor data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseAction = async (courseId, action) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `http://localhost:5000/api/instructor/courses/${courseId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Refresh courses
      fetchInstructorData()
    } catch (error) {
      console.error(`Error ${action} course:`, error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Instructor Dashboard</h1>
              <p className="text-gray-600">Manage your courses and track your performance</p>
            </div>
            <Link
              to="/instructor/create-course"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: BookOpen, label: "My Courses", value: stats.totalCourses, color: "blue" },
            { icon: Users, label: "Total Students", value: stats.totalStudents, color: "green" },
            { icon: TrendingUp, label: "Revenue", value: `৳${stats.totalRevenue}`, color: "purple" },
            { icon: TrendingUp, label: "Avg Rating", value: stats.avgRating.toFixed(1), color: "orange" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Courses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.course_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={course.image_url || "/placeholder.svg?height=50&width=80"}
                          alt={course.title}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">৳{course.price}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.approval_status)}`}
                      >
                        {getStatusIcon(course.approval_status)}
                        {course.approval_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.enrolled_count || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{course.revenue || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/instructor/course/${course.course_id}`}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="View Course"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/instructor/course/${course.course_id}/edit`}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                          title="Edit Course"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {course.approval_status === "draft" && (
                          <button
                            onClick={() => handleCourseAction(course.course_id, "submit")}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                            title="Submit for Approval"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleCourseAction(course.course_id, "delete")}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6">Create your first course to get started.</p>
              <Link
                to="/instructor/create-course"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Create Course
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default InstructorDashboard
