import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { Game } from "@/types"
import { games } from "@/constants/gameData"

interface MiniGamesProps {
  setSelectedGame: (game: Game | null) => void
}

export function MiniGames({ setSelectedGame }: MiniGamesProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Mini-Games</h2>
      {games.length > 0 ? (
        <div className="space-y-4">
          {games.map((game, index) => (
            <GameItem key={index} game={game} setSelectedGame={setSelectedGame} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No mini-games available at the moment. Please check back later!</p>
      )}
    </div>
  )
}

interface GameItemProps {
  game: Game
  setSelectedGame: (game: Game) => void
}

function GameItem({ game, setSelectedGame }: GameItemProps) {
  return (
    <motion.div
      className="bg-indigo-50 p-4 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedGame(game)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <game.icon className="w-8 h-8" />
          <h3 className="font-semibold">{game.name}</h3>
        </div>
        <ChevronDown className="w-5 h-5 text-indigo-600" />
      </div>
    </motion.div>
  )
}

