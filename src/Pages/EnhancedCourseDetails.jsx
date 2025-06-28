"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../Firebase/Firebase_init"

const EnhancedCourseDetails = () => {
  const { id } = useParams()
  const [user] = useAuthState(auth)
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrollmentLoading, setEnrollmentLoading] = useState(false)

  useEffect(() => {
    fetchCourseDetails()
    if (user) {
      checkEnrollmentStatus()
    }
  }, [id, user])

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/course/${id}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data)
      }
    } catch (error) {
      console.error("Error fetching course details:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkEnrollmentStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/enrollment/check/${user.email}/${id}`)
      if (response.ok) {
        const data = await response.json()
        setEnrollment(data)
      }
    } catch (error) {
      console.error("Error checking enrollment:", error)
    }
  }

  const handleEnrollment = async () => {
    if (!user) {
      alert("Please login to enroll in this course")
      return
    }

    setEnrollmentLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await fetch("http://localhost:5000/api/payment/init", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: id,
          coursePrice: course.price,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          window.location.href = data.gatewayPageURL
        }
      } else {
        const error = await response.json()
        alert(error.error || "Failed to initiate payment")
      }
    } catch (error) {
      console.error("Error initiating enrollment:", error)
      alert("Failed to initiate enrollment")
    } finally {
      setEnrollmentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative">
            <img
              src={course.ImageURL || "/placeholder.svg?height=400&width=800"}
              alt={course.Title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{course.Title}</h1>
                <p className="text-lg opacity-90">{course.Description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">📋 Course Information</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-1">⏱️</div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{course.Duration}</p>
                </div>

                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-1">📊</div>
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="font-semibold capitalize">{course.level}</p>
                </div>

                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl mb-1">👥</div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="font-semibold">{course.enrollment_count}</p>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-1">⭐</div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-semibold">{course.rating || "New"}</p>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">About this course</h3>
                <p className="text-gray-700 leading-relaxed">{course.Description}</p>
              </div>
            </div>

            {/* Instructors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">👨‍🏫 Instructors</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {course.Instructors ? course.Instructors.charAt(0) : "I"}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{course.Instructors || "Instructor"}</h3>
                  <p className="text-gray-600">Course Instructor</p>
                </div>
              </div>
            </div>

            {/* Course Modules */}
            {course.modules && course.modules.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">📚 Course Content</h2>
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.ModuleID} className="border border-gray-200 rounded-lg">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-lg">
                          Module {moduleIndex + 1}: {module.ModuleTitle}
                        </h3>
                        {module.ModuleDescription && <p className="text-gray-600 mt-1">{module.ModuleDescription}</p>}
                      </div>

                      {module.lessons && module.lessons.length > 0 && (
                        <div className="p-4">
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.LessonID}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                    {lessonIndex + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium">{lesson.Title}</p>
                                    <p className="text-sm text-gray-500">
                                      {lesson.lesson_type} • {lesson.duration_minutes} min
                                    </p>
                                  </div>
                                </div>

                                {lesson.is_free && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Free Preview
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {course.price > 0 ? `৳${course.price}` : "Free"}
                </div>
                {course.discount_price && course.discount_price < course.price && (
                  <div className="text-lg text-gray-500 line-through">৳{course.discount_price}</div>
                )}
              </div>

              {enrollment?.enrolled ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-green-600 text-2xl mb-2">✅</div>
                    <p className="text-green-800 font-semibold">You're enrolled!</p>
                    <p className="text-green-600 text-sm">Start learning now</p>
                  </div>

                  <Link
                    to={`/course-content/${id}`}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors block text-center"
                  >
                    Continue Learning
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleEnrollment}
                    disabled={enrollmentLoading}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrollmentLoading ? "Processing..." : "Enroll Now"}
                  </button>

                  <div className="text-center text-sm text-gray-600">
                    <p>💳 Secure payment with SSLCommerz</p>
                    <p>📱 Mobile banking supported</p>
                  </div>
                </div>
              )}

              {/* Course Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3">This course includes:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Lifetime access
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Mobile and desktop access
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Certificate of completion
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Instructor support
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Progress tracking
                  </li>
                </ul>
              </div>
            </div>

            {/* Share Course */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-3">📤 Share this course</h3>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                  Facebook
                </button>
                <button className="flex-1 bg-sky-500 text-white py-2 px-3 rounded text-sm hover:bg-sky-600">
                  Twitter
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedCourseDetails
