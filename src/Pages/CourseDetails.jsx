"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, Users, Star, BookOpen, Video, FileText } from "lucide-react"
import axios from "axios"
import { AuthContext } from "../Provider/AuthProvider"
import CourseRecommendations from "../Components/Recommendations/CourseRecommendations"

const CourseDetails = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/course/${id}`)
        setCourse(response.data)

        // Check if user is enrolled
        if (user) {
          const enrollmentResponse = await axios.get(`http://localhost:5000/api/enrollment/check/${user.email}/${id}`)
          setIsEnrolled(enrollmentResponse.data.enrolled)

          // Fetch course recommendations
          if (user) {
            const recommendationsRes = await axios.get(
              `http://localhost:5000/api/course/recommendations/${id}/${user.email}`,
            )
            setRecommendations(recommendationsRes.data.recommendations || [])
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetails()
  }, [id, user])

  const handleEnrollClick = () => {
    if (!user) {
      navigate("/login")
      return
    }
    navigate(`/enroll/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Course Header */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
            <img
              src={course.ImageURL || "/placeholder.svg"}
              alt={course.Title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">{course.Title}</h1>
                <p className="text-xl opacity-90">by {course.Instructors}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Description</h2>
                  <p className="text-gray-600 leading-relaxed">{course.Description}</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">What You'll Learn</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.LearningOutcomes?.split(",").map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{outcome.trim()}</span>
                      </div>
                    )) || <p className="text-gray-600">Learning outcomes will be updated soon.</p>}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Content</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Video className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">Video Lectures</span>
                      <span className="ml-auto text-sm text-gray-500">12 videos</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Reading Materials</span>
                      <span className="ml-auto text-sm text-gray-500">8 documents</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700">Assignments</span>
                      <span className="ml-auto text-sm text-gray-500">5 assignments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{course.price || "99"}TK </div>
                    <div className="text-sm text-gray-500">One-time payment</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{course.Duration}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{course.enrollment_count} students enrolled</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-700">{course.rating} rating</span>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <Link
                      to={`/course-content/${id}`}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-center block hover:bg-green-700 transition"
                    >
                      Continue Learning
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnrollClick}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Enroll Now
                    </button>
                  )}

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">30-day money-back guarantee</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-12">
                <CourseRecommendations recommendations={recommendations} title="You might also like" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CourseDetails
