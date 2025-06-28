"use client"

import { Trophy, Star, TrendingUp } from "lucide-react"

const PointsDisplay = ({ points = 0, level = 1, rank = 0 }) => {
  const getNextLevelPoints = (currentLevel) => {
    return currentLevel * 1000 // 1000 points per level
  }

  const getCurrentLevelProgress = () => {
    const currentLevelPoints = (level - 1) * 1000
    const nextLevelPoints = getNextLevelPoints(level)
    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Points */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium opacity-90">Total Points</span>
          </div>
          <div className="text-3xl font-bold">{points.toLocaleString()}</div>
        </div>

        {/* Level */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium opacity-90">Level</span>
          </div>
          <div className="text-3xl font-bold">{level}</div>
          <div className="mt-2">
            <div className="bg-white/20 rounded-full h-2 mb-1">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${getCurrentLevelProgress()}%` }}
              />
            </div>
            <div className="text-xs opacity-75">{getNextLevelPoints(level) - points} points to next level</div>
          </div>
        </div>

        {/* Rank */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium opacity-90">Global Rank</span>
          </div>
          <div className="text-3xl font-bold">#{rank || "N/A"}</div>
        </div>
      </div>
    </div>
  )
}

export default PointsDisplay
