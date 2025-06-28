"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { BookOpen, Plus, Trash2, Save, Eye } from "lucide-react"
import axios from "axios"
import { AuthContext } from "../Provider/AuthProvider"

const CreateCourse = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [courseData, setCourseData] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    category_id: "",
    price: "",
    original_price: "",
    duration_weeks: 8,
    duration_hours: 40,
    difficulty_level: "Beginner",
    language: "English",
    learning_outcomes: "",
    prerequisites: "",
    target_audience: "",
    certificate_available: true,
  })
  const [courseImage, setCourseImage] = useState(null)
  const [modules, setModules] = useState([
    {
      title: "",
      description: "",
      lessons: [
        {
          title: "",
          content_type: "video",
          video_url: "",
          content_text: "",
          duration_minutes: 0,
          is_preview: false,
        }
      ],
    },
  ])
  const modulesArray = [...modules];


  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setCourseData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
      setCourseData((prev) => ({ ...prev, slug }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCourseImage(file)
    }
  }

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: "",
        description: "",
        lessons: [
          {
            title: "",
            content_type: "video",
            video_url: "",
            content_text: "",
            duration_minutes: 0,
            is_preview: false,
          },
        ],
      },
    ])
  }

  const removeModule = (moduleIndex) => {
    setModules(modules.filter((_, index) => index !== moduleIndex))
  }

  const updateModule = (moduleIndex, field, value) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex][field] = value
    setModules(updatedModules)
  }

  const addLesson = (moduleIndex) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons.push({
      title: "",
      content_type: "video",
      video_url: "",
      content_text: "",
      duration_minutes: 0,
      is_preview: false,
    })
    setModules(updatedModules)
  }

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter(
      (_, index) => index !== lessonIndex,
    )
    setModules(updatedModules)
  }

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value
    setModules(updatedModules)
  }

  const handleSubmit = async (e, isDraft = true) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = await user.getIdToken(true)
      const formData = new FormData()

      // Add course data
      Object.keys(courseData).forEach((key) => {
        formData.append(key, courseData[key])
      })

      // Add image if selected
      if (courseImage) {
        formData.append("course_image", courseImage)
      }

      // Add modules and lessons
      formData.append("modules", JSON.stringify(modules));
      formData.append("approval_status", isDraft ? "draft" : "pending")
      // formData.append("modules", JSON.stringify(modulesArray)) 

      const response = await axios.post("http://localhost:5000/api/instructor/courses", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        navigate("/instructor/dashboard")
      }
    } catch (error) {
      console.error("Error creating course:", error)
      alert("Error creating course. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Create New Course</h1>
              <p className="text-gray-600">Build and publish your course content</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={(e) => handleSubmit(e, true)}>
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category_id"
                  value={courseData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.CategoryID} value={category.CategoryID}>
                      {category.CategoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select
                  name="difficulty_level"
                  value={courseData.difficulty_level}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (৳)</label>
                <input
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (weeks)</label>
                <input
                  type="number"
                  name="duration_weeks"
                  value={courseData.duration_weeks}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                <input
                  type="text"
                  name="short_description"
                  value={courseData.short_description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Brief description of the course"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Detailed course description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </motion.div>

          {/* Course Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Course Content</h2>
              <button
                type="button"
                onClick={addModule}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Module
              </button>
            </div>

            {modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Module {moduleIndex + 1}</h3>
                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(moduleIndex)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModule(moduleIndex, "title", e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Module title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Module Description</label>
                    <input
                      type="text"
                      value={module.description}
                      onChange={(e) => updateModule(moduleIndex, "description", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Module description"
                    />
                  </div>
                </div>

                {/* Lessons */}
                <div className="ml-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-700">Lessons</h4>
                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex)}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Lesson
                    </button>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border border-gray-100 rounded-lg p-4 mb-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-600">Lesson {lessonIndex + 1}</h5>
                        {module.lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLesson(moduleIndex, lessonIndex)}
                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Lesson Title</label>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, "title", e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                            placeholder="Lesson title"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Content Type</label>
                          <select
                            value={lesson.content_type}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, "content_type", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                          >
                            <option value="video">Video</option>
                            <option value="text">Text</option>
                            <option value="live">Live Session</option>
                            <option value="document">Document</option>
                          </select>
                        </div>
                      </div>

                      {lesson.content_type === "video" && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Video URL</label>
                          <input
                            type="url"
                            value={lesson.video_url}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, "video_url", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                            placeholder="YouTube, Vimeo, or other video URL"
                          />
                        </div>
                      )}

                      {lesson.content_type === "text" && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Text Content</label>
                          <textarea
                            value={lesson.content_text}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, "content_text", e.target.value)}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                            placeholder="Lesson content"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Duration (minutes)</label>
                          <input
                            type="number"
                            value={lesson.duration_minutes}
                            onChange={(e) =>
                              updateLesson(
                                moduleIndex,
                                lessonIndex,
                                "duration_minutes",
                                Number.parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center mt-6">
                          <input
                            type="checkbox"
                            id={`preview-${moduleIndex}-${lessonIndex}`}
                            checked={lesson.is_preview}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, "is_preview", e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`preview-${moduleIndex}-${lessonIndex}`} className="text-xs text-gray-600">
                            Free Preview
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-end gap-4"
          >
            <button
              type="button"
              onClick={() => navigate("/instructor/dashboard")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:bg-gray-400 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              {loading ? "Submitting..." : "Submit for Review"}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}

export default CreateCourse
