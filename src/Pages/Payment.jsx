"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CreditCard, Lock, CheckCircle, Smartphone, Building2 } from "lucide-react"
import axios from "axios"
import { AuthContext } from "../Provider/AuthProvider"

const Payment = () => {
  const { courseId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz")
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  const enrollmentData = location.state?.enrollmentData

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/course/${courseId}`)
        setCourse(response.data)
      } catch (error) {
        console.error("Error fetching course details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!enrollmentData) {
      navigate(`/enroll/${courseId}`)
      return
    }

    fetchCourseDetails()
  }, [enrollmentData, courseId, navigate])

  const handlePayment = async (e) => {
    e.preventDefault()
    setProcessing(true)
  
    try {
      if (!user) {
        navigate("/login")
        return
      }
  
      // Get Firebase token
      const token = await user.getIdToken(true)

  
      const paymentData = {
        courseId: courseId,
        courseName: course?.Title || enrollmentData?.courseName,
        coursePrice: course?.price || enrollmentData?.coursePrice || 99,
      }
  
      const response = await axios.post("http://localhost:5000/api/payment/init", paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        
      })
  
      if (response.data.success) {
        window.location.href = response.data.gatewayPageURL
      } else {
        throw new Error(response.data.message || "Payment initialization failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert(error.response?.data?.error || error.message || "Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!enrollmentData && !course) {
    return null
  }

  const coursePrice = course?.price || enrollmentData?.coursePrice || 99

  const totalAmount = Number.parseFloat(coursePrice)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Secure Payment</h1>
            <p className="text-gray-600 mt-2">Complete your course enrollment</p>
          </div>

          {/* Course Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Course Summary</h2>
            <div className="flex gap-4 mb-4">
              <img
                src={course?.ImageURL || "/placeholder.svg?height=80&width=120"}
                alt={course?.Title || enrollmentData?.courseName}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{course?.Title || enrollmentData?.courseName}</h3>
                <p className="text-sm text-gray-600">by {course?.Instructors || "EduPath"}</p>
                <p className="text-sm text-gray-600">{course?.Duration || "8 weeks"}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Course Price</span>
                <span className="font-semibold">৳{coursePrice}</span>
              </div>
              {/* <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Processing Fee</span>
                <span className="font-semibold">৳{processingFee}</span>
              </div> */}
              <hr className="my-3" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600">৳{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-blue-500 bg-blue-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="sslcommerz"
                  checked={paymentMethod === "sslcommerz"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <span className="font-medium text-gray-800">SSLCommerz Payment Gateway</span>
                    <p className="text-sm text-gray-600">Pay with Card, Mobile Banking, or Net Banking</p>
                  </div>
                </div>
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Cards</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Smartphone className="w-5 h-5 text-pink-600" />
                  <span className="text-sm text-gray-700">bKash</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-700">Nagad</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Banking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment}>
            <button
              type="submit"
              disabled={processing}
              className="w-full mt-8 bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Redirecting to Payment Gateway...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Pay ৳{totalAmount.toFixed(2)} - Proceed to Pay
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Your payment information is secure and encrypted
            </p>
            <p className="text-xs text-gray-400">Powered by SSLCommerz - Bangladesh's leading payment gateway</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Payment
