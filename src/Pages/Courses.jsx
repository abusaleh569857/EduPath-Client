import React, { useState } from "react";
import { motion } from "framer-motion";

// Define course categories
const categories = [
  "Admission Courses",
  "HSC Academic Courses",
  "SSC Academic Courses",
  "1-10 Subject Courses",
  "Skill Development",
  "Career Guidance",
];

// Sample courses with images
const allCourses = [
  {
    id: 1,
    category: "Admission Courses",
    title: "Medical Admission Masterclass",
    teacher: "Dr. Tanvir Ahmed",
    duration: "3 Months",
    curriculum: "Biology, Chemistry, Physics (MCQ & Written)",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 2,
    category: "HSC Academic Courses",
    title: "HSC English 1st Paper Crash Course",
    teacher: "Ms. Sharmin Nahar",
    duration: "1.5 Months",
    curriculum: "Grammar, Writing, Reading Comprehension",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 3,
    category: "Skill Development",
    title: "Complete Freelancing with Fiverr",
    teacher: "Nafis Imtiaz",
    duration: "2 Months",
    curriculum: "Gig Research, Client Communication, Delivery",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 4,
    category: "Career Guidance",
    title: "Career Planning for University Students",
    teacher: "Ahmed Shuvo",
    duration: "1 Month",
    curriculum: "Goal Setting, Portfolio, Networking",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 5,
    category: "1-10 Subject Courses",
    title: "Class 6 Science - বাংলা মাধ্যমে",
    teacher: "Mizanur Rahman Sir",
    duration: "1 Month",
    curriculum: "Basic Physics, Chemistry, Biology",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 6,
    category: "SSC Academic Courses",
    title: "SSC Math Full Course",
    teacher: "Rashed Sir",
    duration: "2 Months",
    curriculum: "Algebra, Geometry, Trigonometry",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 7,
    category: "Skill Development",
    title: "Graphic Design with Canva",
    teacher: "Shovon Hasan",
    duration: "1 Month",
    curriculum: "Poster, Banner, Resume Design",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 8,
    category: "Admission Courses",
    title: "University General Knowledge",
    teacher: "Shamim Reza",
    duration: "1.5 Months",
    curriculum: "GK, English, Math Preparation",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 9,
    category: "HSC Academic Courses",
    title: "HSC Chemistry Full Course",
    teacher: "Dr. Mahmudul Hasan",
    duration: "3 Months",
    curriculum: "Inorganic, Organic, Physical Chemistry",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 10,
    category: "SSC Academic Courses",
    title: "SSC ICT Crash Course",
    teacher: "Fahim Arefin",
    duration: "1 Month",
    curriculum: "Basic ICT, MS Office, Networking",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 11,
    category: "Admission Courses",
    title: "Engineering Admission Preparation",
    teacher: "Mehedi Hasan",
    duration: "2.5 Months",
    curriculum: "Math, Physics, English for BUET & CUET",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 12,
    category: "Skill Development",
    title: "Spoken English for Job Seekers",
    teacher: "Zara Hossain",
    duration: "1.5 Months",
    curriculum: "Speaking, Interview, Presentation Skills",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 13,
    category: "Career Guidance",
    title: "Govt Job BCS Preparation",
    teacher: "Md. Shahin Alam",
    duration: "3 Months",
    curriculum: "Bangla, English, GK, Math, Mental Ability",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 14,
    category: "1-10 Subject Courses",
    title: "Class 8 Math Foundation",
    teacher: "Mostofa Sir",
    duration: "2 Months",
    curriculum: "Algebra, Geometry, Word Problems",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 15,
    category: "Skill Development",
    title: "Digital Marketing Basics",
    teacher: "Tanjina Ferdous",
    duration: "1 Month",
    curriculum: "Facebook Ads, SEO, Content Strategy",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 16,
    category: "HSC Academic Courses",
    title: "HSC Biology Interactive Course",
    teacher: "Dr. Sumaiya Khatun",
    duration: "2 Months",
    curriculum: "Zoology, Botany, MCQs",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 17,
    category: "Admission Courses",
    title: "IBA BBA Admission Batch",
    teacher: "Tanveer Chowdhury",
    duration: "2 Months",
    curriculum: "English, Math, Analytical Ability",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
  {
    id: 18,
    category: "Career Guidance",
    title: "Portfolio Building for Freelancers",
    teacher: "Raihan Kabir",
    duration: "1 Month",
    curriculum: "Behance, LinkedIn, CV, Portfolio Sites",
    image: "https://i.ibb.co/0jt29b8y/university-admission.jpg",
  },
];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("Admission Courses");

  const filteredCourses = allCourses.filter(
    (course) => course.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12 px-6">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Our Courses
      </h2>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-bold text-blue-700 mb-1">
                {course.title}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Instructor:</strong> {course.teacher}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Duration:</strong> {course.duration}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Curriculum:</strong> {course.curriculum}
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
