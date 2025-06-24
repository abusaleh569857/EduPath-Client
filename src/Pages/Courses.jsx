"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import axios from "axios"

const Courses = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...")
        const res = await axios.get("http://localhost:5000/api/categories")
        console.log("Categories response:", res.data)
        setCategories(res.data)
        if (res.data.length > 0) {
          setSelectedCategoryId(res.data[0].CategoryID)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories")
      }
    }

    fetchCategories()
  }, [])

  // Load courses when category changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (selectedCategoryId) {
        setLoading(true)
        setError(null)
        try {
          console.log("Fetching courses for category:", selectedCategoryId)
          const res = await axios.get(`http://localhost:5000/api/courses/${selectedCategoryId}`)
          console.log("Courses response:", res.data)
          setCourses(res.data)
        } catch (error) {
          console.error("Error fetching courses:", error)
          setError("Failed to load courses")
          setCourses([])
        } finally {
          setLoading(false)
        }
      }
    }

    fetchCourses()
  }, [selectedCategoryId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12 px-6">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Courses</h2>

      {/* Dynamic Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.CategoryID}
            onClick={() => setSelectedCategoryId(cat.CategoryID)}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
              selectedCategoryId === cat.CategoryID
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
            }`}
          >
            {cat.CategoryName}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center mb-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      )}

      {/* Debug Info */}
      <div className="text-center mb-4 text-sm text-gray-500">
        Selected Category: {selectedCategoryId} | Courses Found: {courses.length}
      </div>

      {/* Course Cards */}
      {!loading && courses.length === 0 && selectedCategoryId && !error && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No courses found for this category.</p>
          <p className="text-gray-500 text-sm mt-2">Try selecting a different category.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <motion.div
            key={course.CourseID}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <img
              src={course.ImageURL || "/placeholder.svg?height=200&width=300"}
              alt={course.Title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-bold text-blue-700 mb-1">{course.Title}</h3>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Instructor:</strong> {course.Instructors || "TBA"}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Duration:</strong> {course.Duration || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                <strong>Description:</strong> {course.Description || "No description available"}
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/course/${course.CourseID}`}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md text-sm text-center hover:shadow-md transition"
                >
                  View Details
                </Link>
                <span className="px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm font-semibold">
                  {course.price || "99"}  BDT
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Courses
