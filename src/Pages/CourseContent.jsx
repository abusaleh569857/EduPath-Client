"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Play, FileText, Download, CheckCircle, Clock, Users, ChevronRight, ChevronDown } from "lucide-react"
import axios from "axios"

const CourseContent = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [activeContent, setActiveContent] = useState(null)
  const [expandedModules, setExpandedModules] = useState({})
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [loading, setLoading] = useState(true)

  // Sample course content structure
  const courseModules = [
    {
      id: 1,
      title: "Introduction to the Course",
      lessons: [
        {
          id: 1,
          title: "Welcome & Course Overview",
          type: "video",
          duration: "5:30",
          videoUrl: "https://www.youtube.com/embed/2ePf9rue1Ao",
          isLive: false,
        },
        {
          id: 2,
          title: "Course Materials",
          type: "document",
          downloadUrl: "#",
          description: "Download the course syllabus and reading materials",
        },
      ],
    },
    {
      id: 2,
      title: "Core Concepts",
      lessons: [
        {
          id: 3,
          title: "Fundamental Principles",
          type: "video",
          duration: "15:45",
          videoUrl: "https://www.youtube.com/embed/I1LSbGfpq0w",
          isLive: false,
        },
        {
          id: 4,
          title: "Live Q&A Session",
          type: "live",
          duration: "60:00",
          streamUrl: "https://streamyard.com/embed/your-stream-id",
          isLive: true,
          scheduledTime: "2024-01-15T10:00:00Z",
        },
        {
          id: 5,
          title: "Practice Exercises",
          type: "document",
          downloadUrl: "#",
          description: "Downloadable practice problems and solutions",
        },
      ],
    },
    {
      id: 3,
      title: "Advanced Topics",
      lessons: [
        {
          id: 6,
          title: "Advanced Techniques",
          type: "video",
          duration: "22:10",
          videoUrl: "https://www.youtube.com/embed/0S6P7yq-g-0",
          isLive: false,
        },
      ],
    },
  ]

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/course/${courseId}`)
        setCourse(response.data)

        // Set first lesson as active by default
        if (courseModules.length > 0 && courseModules[0].lessons.length > 0) {
          setActiveContent(courseModules[0].lessons[0])
          setExpandedModules({ 1: true })
        }
      } catch (error) {
        console.error("Error fetching course content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseContent()
  }, [courseId])

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const selectLesson = (lesson) => {
    setActiveContent(lesson)
  }

  const markLessonComplete = (lessonId) => {
    setCompletedLessons((prev) => new Set([...prev, lessonId]))
  }

  const downloadMaterial = (url, filename) => {
    // Simulate download
    const link = document.createElement("a")
    link.href = url
    link.download = filename || "course-material.pdf"
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{course?.Title}</h1>
          <p className="text-gray-600">by {course?.Instructors}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h2 className="font-semibold text-gray-800 mb-4">Course Content</h2>
              <div className="space-y-2">
                {courseModules.map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
                    >
                      <span className="font-medium text-sm">{module.title}</span>
                      {expandedModules[module.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {expandedModules[module.id] && (
                      <div className="border-t border-gray-200">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => selectLesson(lesson)}
                            className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 ${
                              activeContent?.id === lesson.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {lesson.type === "video" && <Play className="w-4 h-4 text-blue-500" />}
                              {lesson.type === "live" && <Users className="w-4 h-4 text-red-500" />}
                              {lesson.type === "document" && <FileText className="w-4 h-4 text-green-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                              {lesson.duration && <p className="text-xs text-gray-500">{lesson.duration}</p>}
                            </div>
                            {completedLessons.has(lesson.id) && <CheckCircle className="w-4 h-4 text-green-500" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {activeContent ? (
                <>
                  {/* Content Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{activeContent.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {activeContent.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{activeContent.duration}</span>
                            </div>
                          )}
                          {activeContent.isLive && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              LIVE
                            </span>
                          )}
                        </div>
                      </div>
                      {!completedLessons.has(activeContent.id) && (
                        <button
                          onClick={() => markLessonComplete(activeContent.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6">
                    {activeContent.type === "video" && (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <iframe
                          src={activeContent.videoUrl}
                          title={activeContent.title}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {activeContent.type === "live" && (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        {activeContent.isLive ? (
                          <iframe
                            src={activeContent.streamUrl}
                            title={activeContent.title}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-white">
                            <div className="text-center">
                              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <h3 className="text-xl font-semibold mb-2">Live Session Scheduled</h3>
                              <p className="text-gray-300">{new Date(activeContent.scheduledTime).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeContent.type === "document" && (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{activeContent.title}</h3>
                        <p className="text-gray-600 mb-6">{activeContent.description}</p>
                        <button
                          onClick={() => downloadMaterial(activeContent.downloadUrl, activeContent.title)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                        >
                          <Download className="w-5 h-5" />
                          Download Material
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a lesson to start learning</h3>
                  <p className="text-gray-600">Choose from the course content on the left to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseContent
