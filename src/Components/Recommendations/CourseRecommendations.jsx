"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Star, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react"

const CourseRecommendations = ({ recommendations = [], title = "Recommended for You" }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3

  if (recommendations.length === 0) {
    return null
  }

  const totalPages = Math.ceil(recommendations.length / itemsPerPage)
  const currentRecommendations = recommendations.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              disabled={currentIndex === totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRecommendations.map((course) => (
          <div
            key={course.CourseID}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={course.ImageURL || "/placeholder.svg?height=200&width=300"}
              alt={course.Title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{course.Title}</h3>
              <p className="text-sm text-gray-600 mb-3">by {course.Instructors}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{course.rating || "4.5"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.Duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.enrollment_count || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-blue-600">{course.price || "99"} TK</div>
                <Link
                  to={`/course/${course.CourseID}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  View Course
                </Link>
              </div>

              {course.reason && (
                <div className="mt-3 text-xs text-gray-500 bg-blue-50 p-2 rounded">💡 {course.reason}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition ${index === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseRecommendations
