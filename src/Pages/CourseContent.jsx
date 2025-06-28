"use client"

import React, { useState, useEffect, useContext, useMemo } from "react"
import dynamic from "next/dynamic"
import {
  Play,
  FileText,
  Download,
  CheckCircle,
  Clock,
  Users,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import axios from "axios"
import { AuthContext } from "../Provider/AuthProvider"
import { useParams } from "react-router-dom"

// Dynamically import Plyr (client-side only)
const Plyr = dynamic(() => import("plyr-react"), { ssr: false })

// Plyr styles
import "plyr-react/plyr.css"

const CourseContent = () => {
  const { courseId } = useParams()
  const { user } = useContext(AuthContext)

  const [course, setCourse] = useState(null)
  const [courseModules, setCourseModules] = useState([])
  const [activeContent, setActiveContent] = useState(null)
  const [expandedModules, setExpandedModules] = useState({})
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)

  // Robust YouTube Video ID extractor using regex
  const getYouTubeVideoId = (urlOrId) => {
    if (!urlOrId) return null

    const ytRegex =
      /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/

    const match = urlOrId.match(ytRegex)
    if (match && match[1]) {
      return match[1]
    }

    // Assume already an ID if regex doesn't match
    return urlOrId.trim()
  }

  useEffect(() => {
    if (!user || !courseId) return

    const fetchCourseContent = async () => {
      setLoading(true)
      try {
        const token = await user.getIdToken(true)

        const res = await axios.get(
          `http://localhost:5000/api/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const courseData = res.data
        const enrollmentData = courseData.enrollment || null

        setCourse(courseData)
        setEnrollment(enrollmentData)

        const modules = (courseData.modules || []).map((mod) => ({
          id: mod.ModuleID,
          title: mod.ModuleTitle,
          description: mod.ModuleDescription,
          lessons: (mod.lessons || []).map((lesson) => ({
            id: lesson.LessonID,
            title: lesson.Title,
            type: lesson.lesson_type,
            duration: lesson.duration_minutes ? `${lesson.duration_minutes} min` : null,
            videoId: getYouTubeVideoId(lesson.VideoURL),
            isLive: lesson.lesson_type === "live",
            streamUrl: lesson.live_stream_url || null,
            scheduledTime: lesson.live_stream_date || null,
            downloadUrl: lesson.document_url || null,
            description: lesson.Content || "",
          })),
        }))

        setCourseModules(modules)

        // Auto-select first lesson if available
        if (modules.length > 0 && modules[0].lessons.length > 0) {
          setActiveContent(modules[0].lessons[0])
          setExpandedModules({ [modules[0].id]: true })
        }
      } catch (error) {
        console.error("Error fetching course content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseContent()
  }, [courseId, user])

  const toggleModule = (id) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const selectLesson = (lesson) => setActiveContent(lesson)

  const markLessonComplete = (id) => {
    setCompletedLessons((prev) => new Set(prev).add(id))
  }

  const downloadMaterial = (url, name) => {
    const link = document.createElement("a")
    link.href = url
    link.download = name || "material.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const plyrOptions = useMemo(
    () => ({
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "settings",
        "fullscreen",
      ],
      youtube: {
        noCookie: true,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
      },
    }),
    []
  )

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 text-lg">Course not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{course.Title}</h1>
          <p className="text-sm text-gray-600">
            by {course.Instructors || "Unknown Instructor"}
          </p>
          {enrollment && (
            <p className="text-sm text-gray-700 mt-1">
              Status:{" "}
              <span
                className={`font-semibold ${
                  enrollment.enrollment_status === "active"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {enrollment.enrollment_status}
              </span>{" "}
              | Paid: {enrollment.amount_paid} {enrollment.currency}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow sticky top-24 max-h-[80vh] overflow-y-auto">
              <h2 className="font-semibold text-gray-800 mb-4">Course Content</h2>
              <div className="space-y-2">
                {courseModules.map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      {module.title}
                      {expandedModules[module.id] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    {expandedModules[module.id] && (
                      <div className="border-t border-gray-100 max-h-64 overflow-y-auto">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => selectLesson(lesson)}
                            className={`w-full text-left px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 ${
                              activeContent?.id === lesson.id
                                ? "bg-blue-50 border-l-4 border-blue-500"
                                : ""
                            }`}
                          >
                            {lesson.type === "video" && (
                              <Play size={16} className="text-blue-500" />
                            )}
                            {lesson.type === "live" && (
                              <Users size={16} className="text-red-500" />
                            )}
                            {lesson.type === "document" && (
                              <FileText size={16} className="text-green-500" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                            {completedLessons.has(lesson.id) && (
                              <CheckCircle
                                size={16}
                                className="text-green-500 ml-auto"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Player Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow min-h-[400px] overflow-hidden">
              {activeContent ? (
                <>
                  <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {activeContent.title}
                      </h2>
                      <div className="text-sm text-gray-600 flex gap-4 mt-1">
                        {activeContent.duration && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {activeContent.duration}
                          </span>
                        )}
                        {activeContent.isLive && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            LIVE
                          </span>
                        )}
                      </div>
                    </div>
                    {!completedLessons.has(activeContent.id) && (
                      <button
                        onClick={() => markLessonComplete(activeContent.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Mark Complete
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Video (YouTube Plyr Player) */}
                    {activeContent.type === "video" && activeContent.videoId ? (
                      <Plyr
                        source={{
                          type: "youtube",
                          videoId: activeContent.videoId,
                        }}
                        options={plyrOptions}
                      />
                    ) : activeContent.type === "video" ? (
                      <p className="text-center text-gray-500">
                        No video available
                      </p>
                    ) : null}

                    {/* Document */}
                    {activeContent.type === "document" && (
                      <div className="text-center py-12">
                        <FileText
                          size={48}
                          className="text-gray-400 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {activeContent.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {activeContent.description}
                        </p>
                        {activeContent.downloadUrl ? (
                          <button
                            onClick={() =>
                              downloadMaterial(
                                activeContent.downloadUrl,
                                activeContent.title
                              )
                            }
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center mx-auto"
                          >
                            <Download size={18} />
                            Download Material
                          </button>
                        ) : (
                          <p className="text-gray-500">
                            No downloadable material available
                          </p>
                        )}
                      </div>
                    )}

                    {/* Live Stream */}
                    {activeContent.type === "live" && (
                      <div className="text-center p-12 text-white bg-black rounded-lg">
                        {activeContent.streamUrl ? (
                          <iframe
                            src={activeContent.streamUrl}
                            className="w-full aspect-video"
                            allowFullScreen
                            title="Live Stream"
                          />
                        ) : (
                          <>
                            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">
                              Live Session Scheduled
                            </h3>
                            <p className="text-gray-300">
                              {activeContent.scheduledTime
                                ? new Date(
                                    activeContent.scheduledTime
                                  ).toLocaleString()
                                : "Date not set"}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-gray-600">
                  <Play size={40} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">
                    Select a lesson to start
                  </h3>
                  <p>Click a lesson from the left panel</p>
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
