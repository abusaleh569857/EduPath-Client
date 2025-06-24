import React from "react";
import { Link } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaChartLine,
  FaUsers,
  FaGraduationCap,
  FaGamepad,
  FaMobileAlt,
  FaSchool,
} from "react-icons/fa";

const Home = () => {
  const features = [
    {
      icon: <FaChalkboardTeacher className="text-blue-500" size={30} />,
      title: "Live & Recorded Classes",
      desc: "Attend interactive live classes or watch anytime.",
    },
    {
      icon: <FaBookOpen className="text-purple-500" size={30} />,
      title: "Quizzes & Mock Tests",
      desc: "Test your skills with auto-evaluated quizzes.",
    },
    {
      icon: <FaChartLine className="text-green-500" size={30} />,
      title: "AI Progress Tracking",
      desc: "Smart analytics to guide your learning path.",
    },
    {
      icon: <FaUsers className="text-orange-500" size={30} />,
      title: "Group Learning",
      desc: "Boost motivation by learning with peers.",
    },
    {
      icon: <FaGamepad className="text-yellow-500" size={30} />,
      title: "Gamified Motivation",
      desc: "Points, badges & leaderboards to keep you engaged.",
    },
    {
      icon: <FaGraduationCap className="text-red-500" size={30} />,
      title: "Offline Notes & PDFs",
      desc: "Download learning content anytime.",
    },
  ];

  const courses = [
    "HSC Physics",
    "SSC Math",
    "Admission Test Prep",
    "English Grammar",
    "ICT Fundamentals",
    "Bangla 1st Paper",
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold">
            Empowering Students with <span className="text-blue-600">EduPath</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-gray-600 text-lg">
            Personalized learning powered by AI, delivered with care.
          </p>
          <div className="mt-6">
            <Link
              to="/register"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6 py-12">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">How EduPath Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Create Account", "Choose a Course", "Start Learning"].map((step, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow">
                <div className="text-4xl font-bold text-blue-600 mb-2">0{i + 1}</div>
                <h4 className="text-xl font-semibold">{step}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Courses */}
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-4">Popular Courses</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {courses.map((title, i) => (
              <div
                key={i}
                className="p-4 bg-white rounded-lg border hover:shadow transition"
              >
                <h4 className="font-semibold">{title}</h4>
                <Link
                  to="/courses"
                  className="text-blue-500 text-sm mt-2 inline-block"
                >
                  View Course →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* App Promo */}
        <section className="py-16 bg-blue-600 text-white text-center rounded-xl shadow my-16">
          <FaMobileAlt size={40} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Download the EduPath Mobile App</h2>
          <p className="mt-2">Learn anytime, anywhere – even offline.</p>
          <button className="mt-6 px-5 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-100">
            Coming Soon on Play Store
          </button>
        </section>

        {/* Become an Instructor */}
        <section className="text-center my-16">
          <h2 className="text-2xl font-bold mb-2">Are you an Educator?</h2>
          <p className="text-gray-600">Join our mission to teach and inspire millions.</p>
          <Link
            to="/instructor-apply"
            className="mt-4 inline-block bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
          >
            Become an Instructor
          </Link>
        </section>

        {/* Stats */}
        <section className="py-12 grid md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Students Enrolled", value: "10,000+" },
            { label: "Hours of Content", value: "500+" },
            { label: "Quizzes Attempted", value: "25,000+" },
            { label: "Instructors", value: "50+" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded shadow">
              <h3 className="text-3xl font-bold text-blue-600">{item.value}</h3>
              <p className="text-gray-600 mt-2">{item.label}</p>
            </div>
          ))}
        </section>

        {/* Newsletter Signup */}
        <section className="text-center my-16">
          <h2 className="text-2xl font-bold">Stay in the Loop</h2>
          <p className="text-gray-600">Get updates about new courses and features.</p>
          <form className="mt-6 max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* FAQ */}
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Is EduPath free to use?",
                a: "Many courses and quizzes are free. Some premium content may require registration or payment.",
              },
              {
                q: "Can I track my progress?",
                a: "Yes, EduPath uses AI to show personalized progress and recommendations.",
              },
              {
                q: "Is there any live teacher support?",
                a: "Yes! Selected courses offer live mentorship and Q&A support.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold">{faq.q}</h4>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <footer className="bg-gray-900 text-gray-300 py-10 mt-20">
  <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
    {/* About */}
    <div>
      <h3 className="font-bold text-white text-lg mb-2">EduPath Bangladesh</h3>
      <p>
        A student-first, AI-powered learning platform built to empower and educate learners
        across the country, regardless of their background.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="font-semibold text-white mb-2">Quick Links</h4>
      <ul className="space-y-1">
        <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
        <li><Link to="/quizzes" className="hover:text-white">Quizzes</Link></li>
        <li><Link to="/live" className="hover:text-white">Live Classes</Link></li>
        <li><Link to="/about" className="hover:text-white">About Us</Link></li>
      </ul>
    </div>

    {/* Support */}
    <div>
      <h4 className="font-semibold text-white mb-2">Support</h4>
      <ul className="space-y-1">
        <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
        <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
        <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
        <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
      </ul>
    </div>

    {/* Contact Info */}
    <div>
      <h4 className="font-semibold text-white mb-2">Contact</h4>
      <p>House 95, Green Road, Dhaka-1215</p>
      <p>Email: <a href="mailto:support@edupathbd.com" className="hover:underline">support@edupathbd.com</a></p>
      <p>Phone: +880 1234 567 890</p>
    </div>
  </div>

  <p className="text-center text-xs text-gray-500 mt-8">
    © {new Date().getFullYear()} EduPath Bangladesh. All rights reserved.
  </p>
</footer>


    </div>

    
  );
};

export default Home;
