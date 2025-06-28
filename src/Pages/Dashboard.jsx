"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { BookOpen, Clock, Award, TrendingUp, Play, FileText } from "lucide-react"
import axios from "axios"
import { AuthContext } from "../Provider/AuthProvider"
import PointsDisplay from "../Components/Gamification/PointsDisplay"
import AchievementsPanel from "../Components/Gamification/AchievementsPanel"
import CourseRecommendations from "../Components/Recommendations/CourseRecommendations"

const Dashboard = () => {
  const { user, userInfo } = useContext(AuthContext)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [invoices, setInvoices] = useState([])

  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
  })
  const [loading, setLoading] = useState(true)
  const [gamificationData, setGamificationData] = useState({
    points: 0,
    level: 1,
    achievements: [],
    rank: 0,
  })
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.email) {
          const response = await axios.get(`http://localhost:5000/api/user/dashboard/${user.email}`)
          setEnrolledCourses(response.data.courses || [])
          setStats(response.data.stats || stats)
          // Fetch invoices separately
          const invoiceRes = await axios.get(`http://localhost:5000/api/user/invoices/${user.email}`)
          setInvoices(invoiceRes.data.invoices || [])

          const gamificationRes = await axios.get(`http://localhost:5000/api/user/gamification/${user.email}`)
          setGamificationData(gamificationRes.data)

          const recommendationsRes = await axios.get(`http://localhost:5000/api/user/recommendations/${user.email}`)
          setRecommendations(recommendationsRes.data.recommendations || [])
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {userInfo?.first_name || "Student"}! 👋
              </h1>
              <p className="text-gray-600">Continue your learning journey</p>
            </div>
            <div className="hidden md:block">
              <img src="/placeholder.svg?height=100&width=100" alt="Learning illustration" className="w-24 h-24" />
            </div>
          </div>
        </motion.div>

        {/* Points Display */}
        <PointsDisplay points={gamificationData.points} level={gamificationData.level} rank={gamificationData.rank} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: BookOpen, label: "Enrolled Courses", value: stats.totalCourses, color: "blue" },
            { icon: Award, label: "Completed", value: stats.completedCourses, color: "green" },
            { icon: Clock, label: "Learning Hours", value: stats.totalHours, color: "purple" },
            { icon: TrendingUp, label: "Certificates", value: stats.certificates, color: "orange" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
            <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
              Browse More Courses
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses enrolled yet</h3>
              <p className="text-gray-500 mb-6">Start your learning journey by enrolling in a course</p>
              <Link to="/courses" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={course.imageUrl || "/placeholder.svg?height=200&width=300"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">by {course.instructor}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/course-content/${course.id}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Continue
                      </Link>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        {/* Invoices Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Invoices</h2>

          {invoices.length === 0 ? (
            <div className="text-center text-gray-500">No invoices found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Invoice ID</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-t border-gray-200">
                      <td className="px-6 py-4 text-sm text-gray-800">{invoice.transactionId}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{Number(invoice.totalAmount).toFixed(2)} Tk</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.paymentStatus === "completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {invoice.paymentStatus === "completed" ? "Paid" : invoice.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={`/invoice/${invoice.enrollmentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl shadow-xl p-8 mt-8"
        >
          <AchievementsPanel achievements={gamificationData.achievements} />
        </motion.div>

        {/* Course Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8 mt-8"
        >
          <CourseRecommendations recommendations={recommendations} />
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
