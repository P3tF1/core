"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RefreshCw, Beaker, Cake, DollarSign, Heart, Zap, PuzzleIcon as PuzzlePiece } from "lucide-react"

export default function Dashboard() {
  const [pet, setPet] = useState({
    name: "Fluffy",
    type: "Dragon",
    level: 5,
    health: 80,
    energy: 60,
    happiness: 75,
  })

  const [showMiniGames, setShowMiniGames] = useState(false)

  const feedPet = () => {
    setPet((prev) => ({
      ...prev,
      health: Math.min(100, prev.health + 10),
      energy: Math.min(100, prev.energy + 15),
      happiness: Math.min(100, prev.happiness + 5),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-6 text-center">Pet Dashboard</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-white/20 rounded-2xl p-6 backdrop-blur-sm"
            >
              <img
                src="/placeholder.svg?height=300&width=300"
                alt={pet.name}
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <h2 className="text-2xl font-semibold mb-2">{pet.name}</h2>
              <p className="text-lg mb-4">
                {pet.type} - Level {pet.level}
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-red-400" />
                  <div className="bg-gray-200 h-4 flex-1 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pet.health}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-red-400 h-full rounded-full"
                    />
                  </div>
                  <span className="ml-2">{pet.health}%</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                  <div className="bg-gray-200 h-4 flex-1 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pet.energy}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-yellow-400 h-full rounded-full"
                    />
                  </div>
                  <span className="ml-2">{pet.energy}%</span>
                </div>
                <div className="flex items-center">
                  <Beaker className="w-6 h-6 mr-2 text-green-400" />
                  <div className="bg-gray-200 h-4 flex-1 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pet.happiness}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-green-400 h-full rounded-full"
                    />
                  </div>
                  <span className="ml-2">{pet.happiness}%</span>
                </div>
              </div>
            </motion.div>
            <div className="flex-1 space-y-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={feedPet}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center"
              >
                <Cake className="w-6 h-6 mr-2" />
                Feed Pet
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMiniGames(!showMiniGames)}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center"
              >
                <PuzzlePiece className="w-6 h-6 mr-2" />
                {showMiniGames ? "Hide Mini-Games" : "Show Mini-Games"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center"
              >
                <DollarSign className="w-6 h-6 mr-2" />
                Trade Pet
              </motion.button>
              {showMiniGames && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center"
                  >
                    <Zap className="w-6 h-6 mr-2" />
                    Speed Math Challenge
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-purple-500 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center"
                  >
                    <RefreshCw className="w-6 h-6 mr-2" />
                    Card Flip Challenge
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-red-500 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center"
                  >
                    <Beaker className="w-6 h-6 mr-2" />
                    Rock Breaker
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

