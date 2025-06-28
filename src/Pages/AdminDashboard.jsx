"use client"

import { useState, useEffect, useContext } from "react"
import { motion } from "framer-motion"
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Settings,
  Bell,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import axios from "axios"
import { AuthContext } from "../Provider/AuthProvider"

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalInstructors: 0,
    totalRevenue: 0,
    pendingInstructors: 0,
    pendingCourses: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [pendingInstructors, setPendingInstructors] = useState([])
  const [pendingCourses, setPendingCourses] = useState([])
  const [loading, setLoading] = useState(true)

  // State for viewing course details modal
  const [viewingCourse, setViewingCourse] = useState(null)

  useEffect(() => {
    console.log("Current user in AdminDashboard:", user)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = await user.getIdToken(true)
      const [statsRes, activityRes, instructorsRes, coursesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/recent-activity", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/pending-instructors", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/pending-courses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      setStats(statsRes.data)
      setRecentActivity(activityRes.data)
      setPendingInstructors(instructorsRes.data)
      setPendingCourses(coursesRes.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInstructorAction = async (applicationId, action, notes = "") => {
    try {
      const token = await user.getIdToken(true)
      await axios.post(
        `http://localhost:5000/api/admin/instructor-applications/${applicationId}/${action}`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Refresh data
      fetchDashboardData()
    } catch (error) {
      console.error(`Error ${action} instructor:`, error)
    }
  }

  const handleCourseAction = async (courseId, action, reason = "") => {
    try {
      const token = await user.getIdToken(true)
      await axios.post(
        `http://localhost:5000/api/admin/courses/${courseId}/${action}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Refresh data
      fetchDashboardData()
    } catch (error) {
      console.error(`Error ${action} course:`, error)
    }
  }

  // Optional: If you want to fetch fresh details on view
  // const handleViewCourse = async (courseId) => {
  //   try {
  //     const token = await user.getIdToken(true)
  //     const response = await axios.get(`http://localhost:5000/api/admin/courses/${courseId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     setViewingCourse(response.data)
  //   } catch (error) {
  //     console.error("Error fetching course details:", error)
  //   }
  // }

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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your EduPath platform</p>
            </div>
            <div className="flex gap-4">
              <button className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: "Total Users", value: stats.totalUsers, color: "blue", change: "+12%" },
            { icon: BookOpen, label: "Total Courses", value: stats.totalCourses, color: "green", change: "+8%" },
            {
              icon: GraduationCap,
              label: "Instructors",
              value: stats.totalInstructors,
              color: "purple",
              change: "+5%",
            },
            { icon: TrendingUp, label: "Revenue", value: `৳${stats.totalRevenue}`, color: "orange", change: "+15%" },
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
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Instructor Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Pending Instructor Applications</h2>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingInstructors.length} pending
              </span>
            </div>

            <div className="space-y-4">
              {pendingInstructors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending applications</p>
              ) : (
                pendingInstructors.slice(0, 5).map((application) => (
                  <div key={application.application_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {application.first_name} {application.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">{application.email}</p>
                        <p className="text-sm text-gray-500 mt-1">{application.experience_years} years experience</p>
                        <p className="text-xs text-gray-400">
                          Applied: {new Date(application.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleInstructorAction(application.application_id, "approve")}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleInstructorAction(application.application_id, "reject")}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Pending Course Approvals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Pending Course Approvals</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingCourses.length} pending
              </span>
            </div>

            <div className="space-y-4">
              {pendingCourses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending courses</p>
              ) : (
                pendingCourses.slice(0, 5).map((course) => (
                  <div key={course.CourseID} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{course.title}</h3>
                        <p className="text-sm text-gray-600">by {course.instructor_name}</p>
                        <p className="text-sm text-gray-500">Price: ৳{course.price}</p>
                        <p className="text-xs text-gray-400">
                          Submitted: {new Date(course.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleCourseAction(course.CourseID, "approve")}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCourseAction(course.CourseID, "reject")}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewingCourse(course)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 mt-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500">{new Date(activity.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal for viewing course details */}
      {viewingCourse && (
  <div
    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    onClick={() => setViewingCourse(null)}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setViewingCourse(null)}
        aria-label="Close modal"
        className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Course Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
        <img
          src={viewingCourse.ImageURL}
          alt={viewingCourse.Title}
          className="w-full md:w-48 rounded-lg object-cover shadow-md"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{viewingCourse.Title}</h2>
          <p className="text-gray-600 text-sm uppercase tracking-wide font-semibold mb-2">{viewingCourse.level} level | {viewingCourse.language}</p>
          <p className="text-gray-700 text-base">{viewingCourse.short_description || "No short description available."}</p>
        </div>
      </div>

      {/* Course Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">Course Details</h3>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li><strong>Duration:</strong> {viewingCourse.Duration || "N/A"}</li>
            <li><strong>Total Lessons:</strong> {viewingCourse.total_lessons}</li>
            <li><strong>Total Duration:</strong> {viewingCourse.total_duration_minutes} minutes</li>
            <li><strong>Category ID:</strong> {viewingCourse.CategoryID}</li>
            <li><strong>Price:</strong> {viewingCourse.currency} {viewingCourse.discount_price ?? viewingCourse.price}</li>
            <li><strong>Enrollment Count:</strong> {viewingCourse.enrollment_count}</li>
            <li><strong>Rating:</strong> {viewingCourse.rating} ({viewingCourse.review_count} reviews)</li>
            <li><strong>Prerequisites:</strong> {viewingCourse.prerequisites || "None"}</li>
            <li><strong>Learning Outcomes:</strong> {viewingCourse.learning_outcomes || "Not specified"}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">Instructor & Status</h3>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li><strong>Instructor:</strong> {viewingCourse.instructor_name}</li>
            <li><strong>Approval Status:</strong> <span className={`font-semibold ${
              viewingCourse.approval_status === "pending"
                ? "text-yellow-600"
                : viewingCourse.approval_status === "approved"
                ? "text-green-600"
                : "text-red-600"
            }`}>{viewingCourse.approval_status}</span></li>
            <li><strong>Submitted At:</strong> {new Date(viewingCourse.submitted_at).toLocaleString()}</li>
            <li><strong>Approved At:</strong> {viewingCourse.approved_at ? new Date(viewingCourse.approved_at).toLocaleString() : "Not approved"}</li>
            <li><strong>Rejected Reason:</strong> {viewingCourse.rejection_reason || "None"}</li>
            <li><strong>Created At:</strong> {new Date(viewingCourse.created_at).toLocaleString()}</li>
            <li><strong>Updated At:</strong> {new Date(viewingCourse.updated_at).toLocaleString()}</li>
            <li><strong>Slug:</strong> {viewingCourse.slug}</li>
            <li><strong>Featured:</strong> {viewingCourse.is_featured ? "Yes" : "No"}</li>
            <li><strong>Published:</strong> {viewingCourse.is_published ? "Yes" : "No"}</li>
          </ul>
        </div>
      </div>

      {/* Description Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">Full Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{viewingCourse.Description || "No description available."}</p>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default AdminDashboard
