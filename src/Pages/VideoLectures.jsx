import React, { useState } from "react";

const VideoLectures = () => {
  const [activeTab, setActiveTab] = useState("recorded");

  const recordedVideos = [
    {
      id: 1,
      title: "Math: Algebra Basics",
      url: "https://www.youtube.com/embed/2ePf9rue1Ao",
      duration: "15:32",
    },
    {
      id: 2,
      title: "English: Tense Tutorial",
      url: "https://www.youtube.com/embed/I1LSbGfpq0w",
      duration: "18:45",
    },
    {
      id: 3,
      title: "Physics: Motion Explained",
      url: "https://www.youtube.com/embed/0S6P7yq-g-0",
      duration: "22:10",
    },
  ];

  const liveClasses = [
    {
      id: 101,
      title: "Live Chemistry Class",
      teacher: "Dr. Rahman",
      startTime: "10:00 AM",
      platform: "Zoom",
      link: "#", // You can replace with actual Zoom/Meet link
    },
    {
      id: 102,
      title: "Live ICT Q&A",
      teacher: "Ms. Farhana",
      startTime: "11:30 AM",
      platform: "Google Meet",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Video Lectures
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab("recorded")}
            className={`px-6 py-2 rounded-l-full font-medium ${
              activeTab === "recorded"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600"
            }`}
          >
            Recorded
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={`px-6 py-2 rounded-r-full font-medium ${
              activeTab === "live"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600"
            }`}
          >
            Live
          </button>
        </div>

        {/* Recorded Videos */}
        {activeTab === "recorded" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <iframe
                  src={video.url}
                  title={video.title}
                  className="w-full h-48 rounded-t-lg"
                  allowFullScreen
                ></iframe>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Duration: {video.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Live Classes */}
        {activeTab === "live" && (
          <div className="grid md:grid-cols-2 gap-6">
            {liveClasses.map((live) => (
              <div
                key={live.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border-l-4 border-red-500 relative"
              >
                <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-semibold animate-pulse">
                  LIVE
                </span>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {live.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Instructor: {live.teacher}
                </p>
                <p className="text-sm text-gray-600">
                  Starts at: {live.startTime}
                </p>
                <p className="text-sm text-gray-600">
                  Platform: {live.platform}
                </p>
                <a
                  href={live.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Join Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLectures;
