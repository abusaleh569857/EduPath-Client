"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Download, CheckCircle, Calendar, CreditCard } from "lucide-react"
import axios from "axios"

const Invoice = () => {
  const { enrollmentId } = useParams()
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/enrollment/${enrollmentId}`)
        setEnrollment(response.data)
      } catch (error) {
        console.error("Error fetching enrollment:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollment()
  }, [enrollmentId])

  const downloadInvoice = () => {
    // Create a simple invoice download
    const invoiceContent = `
      EDUPATH BANGLADESH - INVOICE
      ============================
      
      Invoice ID: ${enrollment?.transactionId}
      Date: ${new Date(enrollment?.paymentDate).toLocaleDateString()}
      
      Student: ${enrollment?.userEmail}
      Course: ${enrollment?.courseName}
      Amount: $${enrollment?.coursePrice}
      Processing Fee: $2.99
      Total: $${enrollment?.coursePrice + 2.99}
      
      Payment Status: ${enrollment?.paymentStatus}
      Payment Method: ${enrollment?.paymentMethod}
      
      Thank you for choosing EduPath Bangladesh!
    `

    const blob = new Blob([invoiceContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${enrollment?.transactionId}.txt`
    a.click()
    URL.revokeObjectURL(url)
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
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-green-500 text-white p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100">Welcome to your new course</p>
          </div>

          {/* Invoice Content */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-2">EduPath Bangladesh</h2>
                <p className="text-gray-600">Your Learning Partner</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Invoice ID</p>
                <p className="font-mono text-lg">{enrollment?.transactionId}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Student Information</h3>
                <p className="text-gray-600">{enrollment?.userEmail}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Enrolled on {new Date(enrollment?.enrollmentDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Payment Information</h3>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 capitalize">{enrollment?.paymentMethod} Payment</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Paid on {new Date(enrollment?.paymentDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Course Details */}
            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">Course Details</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">{enrollment?.courseName}</span>
                <span className="font-semibold">{enrollment?.coursePrice} TK</span>
              </div>
              {/* <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Processing Fee</span>
                <span className="font-semibold">$2.99</span>
              </div> */}
              <hr className="my-3" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount Paid</span>
                <span className="text-green-600">{enrollment?.coursePrice} TK</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadInvoice}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
              <Link
                to={`/course-content/${enrollment?.courseId}`}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Start Learning
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Invoice
