"use client"

import type React from "react"
import {Trophy, Timer, Hammer} from "lucide-react";
import {useState, useRef, useEffect} from "react"
import {useGameLoop} from "./hooks/useGameLoop"
import type {GameState, Spaceship, Meteorite, Laser, GameConfig} from "./types"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const SPACESHIP_WIDTH = 50
const SPACESHIP_HEIGHT = 50
const METEORITE_SIZE = 40
const LASER_WIDTH = 3
const LASER_HEIGHT = 15
const INITIAL_COUNTDOWN = 3
const SPACESHIP_SPEED = 5

const ASTEROID_COLORS = ["#8B4513", "#A0522D", "#D2691E", "#CD853F", "#DEB887"]

// Game configuration
const gameConfig: GameConfig = {
    meteoriteSpawnRate: 0.02,
    meteoriteSpeedBase: 1,
    meteoriteSpeedVariance: 0.5,
    meteoriteHitsMean: 3,
    meteoriteHitsStdDev: 1,
    laserSpeed: 5,
    laserFireRate: 0.1,
}

// Helper function for normal distribution
function normalDistribution(mean: number, stdDev: number): number {
    const u1 = Math.random()
    const u2 = Math.random()
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
    return Math.round(z * stdDev + mean)
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [gameState, setGameState] = useState<GameState>({
        level: 1,
        score: 0,
        playerStrength: 1,
        playerIntelligence: 1,
        gameOver: false,
        countdown: INITIAL_COUNTDOWN,
    })
    const [spaceship, setSpaceship] = useState<Spaceship>({
        x: CANVAS_WIDTH / 2 - SPACESHIP_WIDTH / 2,
        y: CANVAS_HEIGHT - SPACESHIP_HEIGHT - 10,
        width: SPACESHIP_WIDTH,
        height: SPACESHIP_HEIGHT,
    })
    const [meteorites, setMeteorites] = useState<Meteorite[]>([])
    const [lasers, setLasers] = useState<Laser[]>([])
    const keysPressed = useRef<Set<string>>(new Set())

    useEffect(() => {
        const countdownTimer = setInterval(() => {
            setGameState((prev) => ({
                ...prev,
                countdown: prev.countdown > 0 ? prev.countdown - 1 : 0,
            }))
        }, 1000)

        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressed.current.add(e.key)
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key)
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        return () => {
            clearInterval(countdownTimer)
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

    useGameLoop(() => {
        if (gameState.countdown > 0 || gameState.gameOver) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        moveSpaceship()
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        drawSpaceship(ctx, spaceship)

        setMeteorites((prev) => {
            return prev
                .map((meteorite) => ({
                    ...meteorite,
                    y: meteorite.y + meteorite.speed,
                }))
                .filter((meteorite) => meteorite.y < CANVAS_HEIGHT)
        })

        meteorites.forEach((meteorite) => {
            drawMeteorite(ctx, meteorite)
        })

        setLasers((prev) => {
            return prev
                .map((laser) => ({
                    ...laser,
                    y: laser.y - gameConfig.laserSpeed,
                }))
                .filter((laser) => laser.y > 0)
        })

        lasers.forEach((laser) => {
            drawLaser(ctx, laser)
        })

        checkCollisions()

        if (Math.random() < gameConfig.meteoriteSpawnRate * gameState.level) {
            spawnMeteorite()
        }

        if (Math.random() < gameConfig.laserFireRate) {
            fireLaser()
        }

        if (meteorites.some((meteorite) => meteorite.y + METEORITE_SIZE > spaceship.y)) {
            setGameState((prev) => ({...prev, gameOver: true}))
        }
    })

    const moveSpaceship = () => {
        let newX = spaceship.x
        if (keysPressed.current.has("ArrowLeft")) {
            newX = Math.max(0, spaceship.x - SPACESHIP_SPEED)
        }
        if (keysPressed.current.has("ArrowRight")) {
            newX = Math.min(CANVAS_WIDTH - SPACESHIP_WIDTH, spaceship.x + SPACESHIP_SPEED)
        }
        setSpaceship((prev) => ({...prev, x: newX}))
    }

    const drawSpaceship = (ctx: CanvasRenderingContext2D, spaceship: Spaceship) => {
        ctx.fillStyle = "#4a4a4a"
        ctx.beginPath()
        ctx.moveTo(spaceship.x + spaceship.width / 2, spaceship.y)
        ctx.lineTo(spaceship.x + spaceship.width, spaceship.y + spaceship.height)
        ctx.lineTo(spaceship.x, spaceship.y + spaceship.height)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = "#6a6a6a"
        ctx.beginPath()
        ctx.arc(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2, 10, 0, Math.PI * 2)
        ctx.fill()
    }

    const drawMeteorite = (ctx: CanvasRenderingContext2D, meteorite: Meteorite) => {
        ctx.fillStyle = meteorite.color
        ctx.beginPath()
        ctx.arc(meteorite.x + meteorite.size / 2, meteorite.y + meteorite.size / 2, meteorite.size / 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "white"
        ctx.font = "16px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(meteorite.hits.toString(), meteorite.x + meteorite.size / 2, meteorite.y + meteorite.size / 2)
    }

    const drawLaser = (ctx: CanvasRenderingContext2D, laser: Laser) => {
        ctx.fillStyle = "red"
        ctx.fillRect(laser.x - LASER_WIDTH / 2, laser.y, LASER_WIDTH, LASER_HEIGHT)
    }

    const checkCollisions = () => {
        setMeteorites((prev) => {
            return prev
                .map((meteorite) => {
                    const hitLasers = lasers.filter(
                        (laser) =>
                            laser.x > meteorite.x && laser.x < meteorite.x + METEORITE_SIZE && laser.y < meteorite.y + METEORITE_SIZE,
                    )

                    if (hitLasers.length > 0) {
                        setLasers((prev) => prev.filter((laser) => !hitLasers.includes(laser)))
                        const newHits = Math.max(0, meteorite.hits - gameState.playerStrength * hitLasers.length)
                        if (newHits === 0) {
                            setGameState((prev) => ({
                                ...prev,
                                score: prev.score + meteorite.maxHits * 10,
                            }))
                        }
                        return {
                            ...meteorite,
                            hits: newHits,
                        }
                    }
                    return meteorite
                })
                .filter((meteorite) => meteorite.hits > 0)
        })
    }

    const spawnMeteorite = () => {
        const hits = normalDistribution(gameConfig.meteoriteHitsMean, gameConfig.meteoriteHitsStdDev)
        const newMeteorite: Meteorite = {
            x: Math.random() * (CANVAS_WIDTH - METEORITE_SIZE),
            y: -METEORITE_SIZE,
            speed: gameConfig.meteoriteSpeedBase + (Math.random() * 2 - 1) * gameConfig.meteoriteSpeedVariance,
            hits: Math.max(1, hits),
            maxHits: Math.max(1, hits),
            size: METEORITE_SIZE,
            color: ASTEROID_COLORS[Math.floor(Math.random() * ASTEROID_COLORS.length)],
        }
        setMeteorites((prev) => [...prev, newMeteorite])
    }

    const fireLaser = () => {
        const newLaser: Laser = {
            x: spaceship.x + SPACESHIP_WIDTH / 2,
            y: spaceship.y,
            speed: gameConfig.laserSpeed,
        }
        setLasers((prev) => [...prev, newLaser])
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (gameState.countdown > 0 || gameState.gameOver) return
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left - SPACESHIP_WIDTH / 2
        setSpaceship((prev) => ({
            ...prev,
            x: Math.max(0, Math.min(x, CANVAS_WIDTH - SPACESHIP_WIDTH)),
        }))
    }

    const handleRestart = () => {
        setGameState({
            level: 1,
            score: 0,
            playerStrength: 1,
            playerIntelligence: 1,
            gameOver: false,
            countdown: INITIAL_COUNTDOWN,
        })
        setMeteorites([])
        setLasers([])
        setSpaceship({
            x: CANVAS_WIDTH / 2 - SPACESHIP_WIDTH / 2,
            y: CANVAS_HEIGHT - SPACESHIP_HEIGHT - 10,
            width: SPACESHIP_WIDTH,
            height: SPACESHIP_HEIGHT,
        })
    }

    // return (
    //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
    //         <h1 className="text-4xl font-bold mb-4 text-white">Space Shooter</h1>
    //         <div className="relative">
    //             <canvas
    //                 ref={canvasRef}
    //                 width={CANVAS_WIDTH}
    //                 height={CANVAS_HEIGHT}
    //                 onMouseMove={handleMouseMove}
    //                 className="border-2 border-white"
    //             />
    //             {gameState.countdown > 0 && (
    //                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl font-bold">
    //                     {gameState.countdown}
    //                 </div>
    //             )}
    //             {gameState.gameOver && (
    //                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white">
    //                     <h2 className="text-4xl font-bold mb-4">Game Over</h2>
    //                     <p className="text-2xl mb-4">Score: {gameState.score}</p>
    //                     <button onClick={handleRestart} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    //                         Restart
    //                     </button>
    //                 </div>
    //             )}
    //         </div>
    //         <div className="mt-4 text-white">
    //             <p>Level: {gameState.level}</p>
    //             <p>Score: {gameState.score}</p>
    //             <p>Strength: {gameState.playerStrength}</p>
    //             <p>Intelligence: {gameState.playerIntelligence}</p>
    //         </div>
    //         <div className="mt-4 text-white text-center">
    //             <p>Use left and right arrow keys or mouse to move the spaceship</p>
    //         </div>
    //     </div>
    // )

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-zinc-900 p-6">
            <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
                <div className="flex-1 space-y-6">
                    {/* Stats Bar */}
                    <div
                        className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900">
                        <div className="flex items-center justify-between gap-4">
                            <div
                                className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
                                <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400"/>
                                <div>
                                    <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                        Points
                                    </div>
                                    <div className="text-2xl font-bold">100</div>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
                                <Timer className="w-5 h-5 text-purple-600 dark:text-purple-400"/>
                                <div>
                                    <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                        Time
                                    </div>
                                    <div className="text-2xl font-bold">20s</div>
                                </div>
                            </div>
                            {false && (
                                <div
                                    className="absolute top-4 right-4 animate-bounce bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-lg flex items-center gap-2">
                                    <Trophy className="w-5 h-5"/>
                                    <span>+{800} points!</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Game Container */}
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
                        <h1 className="text-4xl font-bold mb-4 text-white">Space Shooter</h1>
                        <div className="relative">
                            <canvas
                                ref={canvasRef}
                                width={CANVAS_WIDTH}
                                height={CANVAS_HEIGHT}
                                onMouseMove={handleMouseMove}
                                className="border-2 border-white"
                            />
                            {gameState.countdown > 0 && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl font-bold">
                                    {gameState.countdown}
                                </div>
                            )}
                            {gameState.gameOver && (
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white">
                                    <h2 className="text-4xl font-bold mb-4">Game Over</h2>
                                    <p className="text-2xl mb-4">Score: {gameState.score}</p>
                                    <button onClick={handleRestart}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Restart
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 text-white">
                            <p>Level: {gameState.level}</p>
                            <p>Score: {gameState.score}</p>
                            <p>Strength: {gameState.playerStrength}</p>
                            <p>Intelligence: {gameState.playerIntelligence}</p>
                        </div>
                        <div className="mt-4 text-white text-center">
                            <p>Use left and right arrow keys or mouse to move the spaceship</p>
                        </div>
                    </div>
                </div>
                {/* Game Info Panel */}
                <aside
                    className="lg:w-80 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900 sticky top-6 self-start">
                    <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-6">
                        Game Stats
                    </h3>
                    <div className="flex flex-col items-center mb-6">
                        <div
                            className="w-24 h-24 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                            <Hammer className="w-12 h-12 text-purple-600 dark:text-purple-400"/>
                        </div>
                        <h4 className="text-xl font-bold mb-1">Rock Breaker</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                            Break rocks to earn points!
                        </p>
                    </div>
                    <div className="space-y-4">
                        <StatBar
                            label="Score"
                            value={200}
                            max={1000}
                            color="bg-purple-500"
                        />
                        <StatBar
                            label="Time Left"
                            value={201}
                            max={205}
                            color="bg-blue-500"
                        />
                        <StatBar
                            label="Rocks Broken"
                            value={Math.floor(10 / 5)}
                            max={100}
                            color="bg-green-500"
                        />
                    </div>
                </aside>
            </div>
        </div>
    );

    function PetPanel({pet}) {
        if (!pet) return null;

        return (
            <aside
                className="lg:w-80 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900 sticky top-6 self-start">
                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-6">
                    Pet Details
                </h3>
                <div className="flex flex-col items-center mb-6">
                    <div
                        className="w-24 h-24 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                        <span className="text-5xl">{pet.icon}</span>
                    </div>
                    <h4 className="text-xl font-bold mb-1">{pet.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{pet.type}</p>
                </div>

                <div className="space-y-4">
                    <StatBar
                        label="Level"
                        value={pet.level}
                        max={20}
                        color="bg-green-500"
                    />
                    <StatBar
                        label="Strength"
                        value={pet.strength}
                        max={20}
                        color="bg-red-500"
                    />
                </div>
            </aside>
        );
    }

    function StatBar({label, value, max, color}) {
        const percentage = (value / max) * 100;
        return (
            <div className="group">
                <div className="flex justify-between text-sm font-medium mb-2">
                    <span>{label}</span>
                    <span className="text-gray-600 dark:text-gray-400">
					{value}/{max}
				</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full ${color} transition-all duration-500 ease-out group-hover:opacity-90`}
                        style={{width: `${percentage}%`}}
                    />
                </div>
            </div>
        );
    }
}

