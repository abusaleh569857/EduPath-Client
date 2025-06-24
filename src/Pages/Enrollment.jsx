"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, Shield } from "lucide-react"
import axios from "axios"
import { AuthContext } from "../Provider/AuthProvider"

const Enrollment = () => {
  const { courseId } = useParams()
  const { user, userInfo } = useContext(AuthContext)
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/course/${courseId}`)
        setCourse(response.data)
      } catch (error) {
        console.error("Error fetching course:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  const handleEnrollment = async () => {
    if (!agreeTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    try {
      const enrollmentPayload = {
        userId: user.uid,
        userEmail: user.email,
        courseId: courseId,
        courseName: course.Title,
        courseprice: course.price || 99,
        enrollmentDate: new Date().toISOString(),
      }

      // Navigate to payment page (SSLCommerz)
      navigate(`/payment/${courseId}`, { state: { enrollmentData: enrollmentPayload } })
    } catch (error) {
      console.error("Enrollment error:", error)
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
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Complete Your Enrollment</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Course Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Course Summary</h2>
              <div className="flex gap-4 mb-4">
                <img
                  src={course?.ImageURL || "/placeholder.svg"}
                  alt={course?.Title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{course?.Title}</h3>
                  <p className="text-sm text-gray-600">by {course?.Instructors}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{course?.Duration || "8 weeks"}</span>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">৳{course?.price || "99"}</span>
                </div>
              </div>
            </div>

            {/* Enrollment Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Information</h2>
              <div className="space-y-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p><strong>Name:</strong> {`${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`}</p>
                <p><strong>Email:</strong> {user?.email || ""}</p>
              </div>

              <div className="flex items-start gap-3 mb-6">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                onClick={handleEnrollment}
                disabled={!agreeTerms}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Payment secured via SSLCommerz</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Enrollment
