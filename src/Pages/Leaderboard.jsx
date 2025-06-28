"use client"

import { useState, useEffect, useContext } from "react"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"
import axios from "axios"
import { AuthContext } from "../Provider/AuthProvider"

const Leaderboard = () => {
  const { user } = useContext(AuthContext)
  const [leaderboard, setLeaderboard] = useState([])
  const [timeframe, setTimeframe] = useState("all") // all, month, week
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [timeframe])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:5000/api/leaderboard?timeframe=${timeframe}`)
      setLeaderboard(response.data.leaderboard || [])

      if (user) {
        const userRankResponse = await axios.get(
          `http://localhost:5000/api/user/rank/${user.email}?timeframe=${timeframe}`,
        )
        setUserRank(userRankResponse.data.rank)
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>
    }
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
    return "bg-white border border-gray-200"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🏆 Leaderboard</h1>
          <p className="text-gray-600">See how you rank against other learners</p>
        </div>

        {/* Timeframe Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-center gap-4">
            {[
              { key: "all", label: "All Time" },
              { key: "month", label: "This Month" },
              { key: "week", label: "This Week" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setTimeframe(option.key)}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  timeframe === option.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* User's Current Rank */}
        {userRank && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Your Current Rank</h3>
                <p className="opacity-90">Keep learning to climb higher!</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">#{userRank.rank}</div>
                <div className="text-sm opacity-90">{userRank.points} points</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Top Learners
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {leaderboard.map((user, index) => {
              const rank = index + 1
              return (
                <div
                  key={user.email}
                  className={`p-6 flex items-center gap-4 ${getRankBadge(rank)} ${rank <= 3 ? "shadow-sm" : ""}`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0">{getRankIcon(rank)}</div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoURL || "/placeholder.svg?height=40&width=40"}
                        alt={user.first_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className={`font-semibold ${rank <= 3 ? "text-white" : "text-gray-800"}`}>
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className={`text-sm ${rank <= 3 ? "text-white/80" : "text-gray-600"}`}>Level {user.level}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className={`text-xl font-bold ${rank <= 3 ? "text-white" : "text-gray-800"}`}>
                      {user.total_points?.toLocaleString() || 0}
                    </div>
                    <div className={`text-sm ${rank <= 3 ? "text-white/80" : "text-gray-600"}`}>points</div>
                  </div>

                  {/* Courses Completed */}
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${rank <= 3 ? "text-white" : "text-gray-800"}`}>
                      {user.completed_courses || 0}
                    </div>
                    <div className={`text-sm ${rank <= 3 ? "text-white/80" : "text-gray-600"}`}>courses</div>
                  </div>
                </div>
              )
            })}
          </div>

          {leaderboard.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No rankings yet</h3>
              <p>Be the first to earn points and claim the top spot!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
