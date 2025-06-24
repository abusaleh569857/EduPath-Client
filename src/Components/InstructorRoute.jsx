"use client"

import { useContext, useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../Provider/AuthProvider"
import axios from "axios"

const InstructorRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()
  const [userInfo, setUserInfo] = useState(null)
  const [infoLoading, setInfoLoading] = useState(true)

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const token = await user.getIdToken(true)
          const response = await axios.get("http://localhost:5000/api/user/info", {
            headers: { Authorization: `Bearer ${token}` },
          })
          setUserInfo(response.data.user) // ✅ only set the user object
        } catch (error) {
          console.error("Failed to fetch user info:", error)
          setUserInfo(null)
        } finally {
          setInfoLoading(false)
        }
      } else {
        setInfoLoading(false)
      }
    }

    fetchUserInfo()
  }, [user])

  if (loading || infoLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700 mt-4">Loading, please wait...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (userInfo?.role !== "instructor" && userInfo?.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default InstructorRoute
