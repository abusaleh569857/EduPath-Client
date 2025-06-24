"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, Download, BookOpen } from "lucide-react"

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  const status = searchParams.get("status")
  const transactionId = searchParams.get("transaction_id")

  useEffect(() => {
    if (transactionId) {
      // Fetch payment details
      fetch(`http://localhost:5000/api/payment/status/${transactionId}`)
        .then((res) => res.json())
        .then((data) => {
          setPaymentDetails(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching payment details:", error)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [transactionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-green-500 text-white p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100">Welcome to your new course</p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            {paymentDetails && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course:</span>
                      <span className="font-medium">{paymentDetails.course_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-sm">{paymentDetails.transaction_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium text-green-600">৳{paymentDetails.total_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date:</span>
                      <span className="font-medium">{new Date(paymentDetails.payment_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600 capitalize">{paymentDetails.enrollment_status}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to={`/course-content/${paymentDetails.course_id}`}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    <BookOpen className="w-5 h-5" />
                    Start Learning
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                  >
                    <Download className="w-5 h-5" />
                    Download Receipt
                  </button>
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </>
            )}

            {!paymentDetails && (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Confirmed</h2>
                <p className="text-gray-600 mb-6">Your enrollment has been processed successfully.</p>
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentSuccess
