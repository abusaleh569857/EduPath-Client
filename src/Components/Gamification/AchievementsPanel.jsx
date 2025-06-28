import { Award, Lock, CheckCircle } from "lucide-react"

const AchievementsPanel = ({ achievements = [] }) => {
  const allAchievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first course",
      icon: "🎯",
      points: 100,
      requirement: "complete_first_course",
    },
    {
      id: 2,
      name: "Knowledge Seeker",
      description: "Enroll in 5 courses",
      icon: "📚",
      points: 250,
      requirement: "enroll_5_courses",
    },
    {
      id: 3,
      name: "Dedicated Learner",
      description: "Study for 10 hours",
      icon: "⏰",
      points: 300,
      requirement: "study_10_hours",
    },
    {
      id: 4,
      name: "Quiz Master",
      description: "Score 90% or higher on 5 quizzes",
      icon: "🧠",
      points: 400,
      requirement: "quiz_master",
    },
    {
      id: 5,
      name: "Course Collector",
      description: "Complete 10 courses",
      icon: "🏆",
      points: 1000,
      requirement: "complete_10_courses",
    },
    {
      id: 6,
      name: "Speed Learner",
      description: "Complete a course in under 24 hours",
      icon: "⚡",
      points: 500,
      requirement: "speed_learner",
    },
  ]

  const isAchievementUnlocked = (requirement) => {
    return achievements.some((achievement) => achievement.achievement_type === requirement)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-yellow-500" />
        Achievements
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAchievements.map((achievement) => {
          const isUnlocked = isAchievementUnlocked(achievement.requirement)

          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                isUnlocked ? "border-yellow-300 bg-yellow-50 shadow-md" : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-2xl ${isUnlocked ? "" : "grayscale"}`}>{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${isUnlocked ? "text-gray-800" : "text-gray-500"}`}>
                      {achievement.name}
                    </h3>
                    {isUnlocked ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className={`text-sm mb-2 ${isUnlocked ? "text-gray-600" : "text-gray-400"}`}>
                    {achievement.description}
                  </p>
                  <div className={`text-xs font-medium ${isUnlocked ? "text-yellow-600" : "text-gray-400"}`}>
                    +{achievement.points} points
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        <div className="text-sm text-gray-600">
          {achievements.length} of {allAchievements.length} achievements unlocked
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(achievements.length / allAchievements.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default AchievementsPanel
