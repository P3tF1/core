import type React from "react"

interface GameEndSceneProps {
    points: number
    onRestart: () => void
}

const GameEndScene: React.FC<GameEndSceneProps> = ({ points, onRestart }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
                <p className="text-2xl mb-4">Your score: {points} points</p>
                <button onClick={onRestart} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Play Again
                </button>
            </div>
        </div>
    )
}

export default GameEndScene

