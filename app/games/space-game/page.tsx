"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useGameLoop } from "./hooks/useGameLoop"
import type { GameState, Spaceship, Meteorite, Laser } from "./types"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const SPACESHIP_WIDTH = 50
const SPACESHIP_HEIGHT = 50
const METEORITE_SIZE = 40
const LASER_SPEED = 5
const LASER_WIDTH = 3
const LASER_HEIGHT = 15
const INITIAL_COUNTDOWN = 3
const SPACESHIP_SPEED = 5

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

        // Move spaceship based on arrow key input
        moveSpaceship()

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        // Draw spaceship
        drawSpaceship(ctx, spaceship)

        // Update and draw meteorites
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

        // Update and draw lasers
        setLasers((prev) => {
            return prev
                .map((laser) => ({
                    ...laser,
                    y: laser.y - LASER_SPEED,
                }))
                .filter((laser) => laser.y > 0)
        })

        lasers.forEach((laser) => {
            drawLaser(ctx, laser)
        })

        // Check collisions
        checkCollisions()

        // Spawn new meteorites
        if (Math.random() < 0.02 * gameState.level) {
            spawnMeteorite()
        }

        // Auto-fire lasers
        if (Math.random() < 0.1) {
            fireLaser()
        }

        // Check game over condition
        if (meteorites.some((meteorite) => meteorite.y + METEORITE_SIZE > spaceship.y)) {
            setGameState((prev) => ({ ...prev, gameOver: true }))
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
        setSpaceship((prev) => ({ ...prev, x: newX }))
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
        ctx.fillStyle = "#8B4513"
        ctx.beginPath()
        ctx.arc(meteorite.x + meteorite.size / 2, meteorite.y + meteorite.size / 2, meteorite.size / 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "white"
        ctx.font = "16px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(meteorite.strength.toString(), meteorite.x + meteorite.size / 2, meteorite.y + meteorite.size / 2)
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
                        return {
                            ...meteorite,
                            strength: meteorite.strength - gameState.playerStrength * hitLasers.length,
                        }
                    }
                    return meteorite
                })
                .filter((meteorite) => meteorite.strength > 0)
        })

        setGameState((prev) => ({
            ...prev,
            score: prev.score + 10 * gameState.playerStrength,
        }))
    }

    const spawnMeteorite = () => {
        const newMeteorite: Meteorite = {
            x: Math.random() * (CANVAS_WIDTH - METEORITE_SIZE),
            y: -METEORITE_SIZE,
            speed: 1 + Math.random() * 2 * (gameState.level / gameState.playerIntelligence),
            strength: Math.ceil(Math.random() * 5 * gameState.level),
            size: METEORITE_SIZE,
        }
        setMeteorites((prev) => [...prev, newMeteorite])
    }

    const fireLaser = () => {
        const newLaser: Laser = {
            x: spaceship.x + SPACESHIP_WIDTH / 2,
            y: spaceship.y,
            speed: LASER_SPEED,
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

    return (
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl font-bold">
                        {gameState.countdown}
                    </div>
                )}
                {gameState.gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white">
                        <h2 className="text-4xl font-bold mb-4">Game Over</h2>
                        <p className="text-2xl mb-4">Score: {gameState.score}</p>
                        <button onClick={handleRestart} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
    )
}

