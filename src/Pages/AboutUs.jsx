import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-center mb-8">
          About <span className="text-blue-600">EduPath Bangladesh</span>
        </h1>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            EduPath Bangladesh is dedicated to providing accessible, inclusive, and
            personalized education to students across Bangladesh. By leveraging AI
            technology, we aim to empower learners from all backgrounds, especially
            underprivileged communities, to achieve their academic goals and build a
            brighter future.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            We envision a Bangladesh where every student, regardless of location or
            socio-economic status, has access to quality educational resources,
            personalized learning experiences, and a supportive community that
            inspires lifelong learning.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Why Choose EduPath?
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg max-w-3xl mx-auto">
            <li>AI-powered personalized learning paths tailored to your needs.</li>
            <li>Live and recorded classes with expert instructors.</li>
            <li>Interactive quizzes and mock tests to track your progress.</li>
            <li>Offline PDF notes and resources for anytime learning.</li>
            <li>Community-driven group learning and peer support.</li>
            <li>Gamified motivation to keep you engaged and inspired.</li>
          </ul>
        </section>

        <section className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Shakil Hossain", role: "Founder & CEO" },
              { name: "Ayesha Rahman", role: "Head of Content" },
              { name: "Tanvir Ahmed", role: "Lead Developer" },
              { name: "Farhana Islam", role: "Community Manager" },
            ].map(({ name, role }, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-24 w-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-xl font-semibold text-center">{name}</h3>
                <p className="text-gray-600 text-center mt-1">{role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mt-20">
          <Link
            to="/register"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Join EduPath Today
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
