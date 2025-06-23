import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Courses = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [courses, setCourses] = useState([]);

  // Load categories on mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/categories").then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setSelectedCategoryId(res.data[0].CategoryID);
      }
    });
  }, []);

  // Load courses when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      axios
        .get(`http://localhost:5000/api/courses/${selectedCategoryId}`)
        .then((res) => setCourses(res.data));
    }
  }, [selectedCategoryId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12 px-6">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Our Courses
      </h2>

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

      {/* Course Cards */}
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
              src={course.ImageURL}
              alt={course.Title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-bold text-blue-700 mb-1">
                {course.Title}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Instructor:</strong> {course.Instructors}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Duration:</strong> {course.Duration || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Curriculum:</strong> {course.Description}
              </p>
              <button className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md text-sm hover:shadow-md transition">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
