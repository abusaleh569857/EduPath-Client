"use client"

import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../Provider/AuthProvider"

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700 mt-4">Loading, please wait...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return children
  }

  return <Navigate to="/login" state={{ from: location }} replace />
}

export default PrivateRoute
