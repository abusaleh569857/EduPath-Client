import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
            Welcome to <span className="text-blue-600">EduPath Bangladesh</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            An AI-powered, inclusive EdTech platform designed to personalize
            learning, empower students, and support underprivileged learners
            across the country.
          </p>
          <div>
            Shakil
          </div>
          <div className="mt-8 space-x-4">
            <Link
              to="/videos"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Join Live Class
            </Link>
            <Link
              to="/quizzes"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Try a Quiz
            </Link>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Live & Recorded Classes",
              desc: "Attend live classes or watch recordings anytime.",
            },
            {
              title: "Quizzes & Mock Tests",
              desc: "Practice and evaluate yourself with interactive quizzes.",
            },
            {
              title: "PDF Notes & Resources",
              desc: "Access downloadable notes and materials offline.",
            },
            {
              title: "AI-Powered Progress Tracking",
              desc: "Track your learning journey with smart analytics.",
            },
            {
              title: "Group-based Learning",
              desc: "Get grouped by performance and get personal support.",
            },
            {
              title: "Gamified Motivation",
              desc: "Earn points, badges, and top the leaderboard!",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-800">
            Ready to explore more?
          </h2>
          <p className="mt-2 text-gray-600">
            Sign up now and start your personalized learning journey.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Get Started
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
