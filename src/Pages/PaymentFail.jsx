"use client"

import { useSearchParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { XCircle, RefreshCw, Home } from "lucide-react"

const PaymentFail = () => {
  const [searchParams] = useSearchParams()
  const error = searchParams.get("error")
  const transactionId = searchParams.get("transaction_id")

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "validation_failed":
        return "Payment validation failed. Please try again."
      case "payment_not_found":
        return "Payment record not found. Please contact support."
      case "processing_error":
        return "Payment processing error occurred. Please try again."
      default:
        return "Payment was unsuccessful. Please try again or contact support."
    }
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
          {/* Error Header */}
          <div className="bg-red-500 text-white p-8 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
            <p className="text-red-100">Your payment could not be processed</p>
          </div>

          {/* Error Details */}
          <div className="p-8 text-center">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">What happened?</h2>
              <p className="text-gray-600 mb-4">{getErrorMessage(error)}</p>

              {transactionId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">Transaction ID:</p>
                  <p className="font-mono text-sm text-gray-800">{transactionId}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@edupath.com" className="text-blue-600 hover:underline">
                  support@edupath.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentFail
