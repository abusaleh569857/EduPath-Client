"use client"

import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { AuthContext } from "../Provider/AuthProvider"
import {
  BookOpen,
  ChevronDown,
  Plus,
  Video,
  FileText,
  Clock,
  Edit3,
  Trash2,
  Eye,
  PlayCircle,
  Users,
  X,
  Save,
  DotIcon as DragHandleDots2,
} from "lucide-react"

const BASE_URL = "http://localhost:5000"

const InstructorCourseContentManager = () => {
  const { user } = useContext(AuthContext)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [selectedModuleId, setSelectedModuleId] = useState(null)
  const [expandedModules, setExpandedModules] = useState(new Set())
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" })
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    videoURL: "",
    type: "video",
    duration: 5,
    isFree: true,
  })

  // Fetch instructor's courses
  const fetchCourses = async () => {
    try {
      const token = await user.getIdToken(true)
      const res = await axios.get(`${BASE_URL}/api/instructor/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCourses(res.data)
      if (res.data.length > 0) {
        setSelectedCourse(res.data[0])
      }
    } catch (err) {
      console.error("Error fetching courses", err)
    }
  }

  // Fetch modules + lessons for selected course
  const fetchContent = async (courseId) => {
    setLoading(true)
    try {
      const token = await user.getIdToken(true)
      const res = await axios.get(`${BASE_URL}/api/instructor/courses/${courseId}/content`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setContent(res.data)
    } catch (err) {
      console.error("Error fetching content", err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      fetchContent(selectedCourse.CourseID)
    }
  }, [selectedCourse])

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleAddModule = async (e) => {
    e.preventDefault()
    if (!moduleForm.title.trim()) return

    try {
      const token = await user.getIdToken(true)
      await axios.post(
        `${BASE_URL}/api/instructor/modules`,
        {
          CourseID: selectedCourse.CourseID,
          Title: moduleForm.title,
          Description: moduleForm.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setModuleForm({ title: "", description: "" })
      setShowModuleModal(false)
      fetchContent(selectedCourse.CourseID)
    } catch (err) {
      console.error("Error adding module", err)
    }
  }

  const handleAddLesson = async (e) => {
    e.preventDefault()
    if (!lessonForm.title.trim()) return

    try {
      const token = await user.getIdToken(true)
      await axios.post(
        `${BASE_URL}/api/instructor/lessons`,
        {
          ModuleID: selectedModuleId,
          Title: lessonForm.title,
          Content: lessonForm.content,
          VideoURL: lessonForm.videoURL,
          lesson_type: lessonForm.type,
          duration_minutes: lessonForm.duration,
          is_free: lessonForm.isFree ? 1 : 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setLessonForm({
        title: "",
        content: "",
        videoURL: "",
        type: "video",
        duration: 5,
        isFree: true,
      })
      setShowLessonModal(false)
      setSelectedModuleId(null)
      fetchContent(selectedCourse.CourseID)
    } catch (err) {
      console.error("Error adding lesson", err)
    }
  }

  const openLessonModal = (moduleId) => {
    setSelectedModuleId(moduleId)
    setShowLessonModal(true)
  }

  const getLessonIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4 text-red-500" />
      case "text":
        return <FileText className="w-4 h-4 text-blue-500" />
      case "live":
        return <PlayCircle className="w-4 h-4 text-green-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getTotalDuration = (lessons) => {
    return lessons.reduce((total, lesson) => total + (lesson.duration_minutes || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <BookOpen className="text-blue-600" />
                Course Content Manager
              </h1>
              <p className="text-gray-600">Organize and manage your course modules and lessons</p>
            </div>

            {/* Course Selector */}
            <div className="lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
              <select
                value={selectedCourse?.CourseID || ""}
                onChange={(e) => setSelectedCourse(courses.find((c) => c.CourseID === Number.parseInt(e.target.value)))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {courses.map((course) => (
                  <option key={course.CourseID} value={course.CourseID}>
                    {course.Title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedCourse && (
          <>
            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Modules</p>
                    <p className="text-2xl font-bold text-blue-600">{content.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Lessons</p>
                    <p className="text-2xl font-bold text-green-600">
                      {content.reduce((total, mod) => total + (mod.lessons?.length || 0), 0)}
                    </p>
                  </div>
                  <Video className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Duration</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {content.reduce((total, mod) => total + getTotalDuration(mod.lessons || []), 0)} min
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Enrolled</p>
                    <p className="text-2xl font-bold text-orange-600">{selectedCourse.enrolled_count || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Add Module Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Course Content</h2>
              <button
                onClick={() => setShowModuleModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Module
              </button>
            </div>
          </>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course content...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {content.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No modules yet</h3>
                <p className="text-gray-600 mb-6">Start building your course by adding your first module</p>
                <button
                  onClick={() => setShowModuleModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Create First Module
                </button>
              </div>
            ) : (
              content.map((module, moduleIndex) => (
                <div key={module.ModuleID} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Module Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <DragHandleDots2 className="w-5 h-5 text-gray-400 cursor-move" />
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            Module {moduleIndex + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{module.Title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{module.Description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm text-gray-500">
                          <p>{module.lessons?.length || 0} lessons</p>
                          <p>{getTotalDuration(module.lessons || [])} min</p>
                        </div>
                        <button
                          onClick={() => openLessonModal(module.ModuleID)}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-all text-sm font-medium"
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          Add Lesson
                        </button>
                        <button
                          onClick={() => toggleModule(module.ModuleID)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 transition-transform ${
                              expandedModules.has(module.ModuleID) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {expandedModules.has(module.ModuleID) && (
                    <div className="p-6 bg-gray-50">
                      {module.lessons?.length === 0 ? (
                        <div className="text-center py-8">
                          <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-4">No lessons in this module yet</p>
                          <button
                            onClick={() => openLessonModal(module.ModuleID)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
                          >
                            Add First Lesson
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.LessonID}
                              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-500 font-medium w-8">{lessonIndex + 1}.</span>
                                  {getLessonIcon(lesson.lesson_type)}
                                  <div>
                                    <h4 className="font-medium text-gray-800">{lesson.Title}</h4>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                      <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                                        {lesson.lesson_type}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {lesson.duration_minutes} min
                                      </span>
                                      {lesson.is_free && (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Free</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {lesson.VideoURL && (
                                    <a
                                      href={lesson.VideoURL}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                                      title="Preview"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </a>
                                  )}
                                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all">
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Add Module Modal */}
        {showModuleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">Add New Module</h3>
                  <button
                    onClick={() => setShowModuleModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddModule} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module Title *</label>
                  <input
                    type="text"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter module title"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter module description"
                    rows="3"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModuleModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Create Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Lesson Modal */}
        {showLessonModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">Add New Lesson</h3>
                  <button
                    onClick={() => setShowLessonModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddLesson} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter lesson title"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
                  <select
                    value={lessonForm.type}
                    onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="video">Video</option>
                    <option value="text">Text</option>
                    <option value="live">Live Session</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>

                {lessonForm.type === "video" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                    <input
                      type="url"
                      value={lessonForm.videoURL}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoURL: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={lessonForm.content}
                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter lesson content or description"
                    rows="4"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: Number.parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    min="1"
                  />
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={lessonForm.isFree}
                      onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Make this lesson free</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLessonModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Add Lesson
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorCourseContentManager
