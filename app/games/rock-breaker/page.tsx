/// <reference lib="dom" />
"use client"

import {useState, useEffect, useCallback} from "react"
import Rock from "./components/Rock"
import {generateRocks, type RockType} from "./utils/rockUtils"
import BackgroundScene from "./components/BackgroundScene"
import StartTimer from "./components/StartTimer"
import GameEndScene from "./components/GameEndScene"

const GAME_DURATION = 60 // 60 seconds game duration

export default function RockBreakingGame() {
    const [rocks, setRocks] = useState<RockType[]>([])
    const [points, setPoints] = useState(0)
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
    const [gameStarted, setGameStarted] = useState(false)
    const [gameEnded, setGameEnded] = useState(false)
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION)

    useEffect(() => {
        setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)())
    }, [])

    useEffect(() => {
        if (gameStarted && !gameEnded) {
            setRocks(generateRocks(10))
            const rockInterval = setInterval(() => {
                setRocks((prevRocks) => {
                    const updatedRocks = prevRocks
                        .map((rock) => ({
                            ...rock,
                            decay: rock.decay - 1,
                        }))
                        .filter((rock) => rock.decay > 0)

                    if (updatedRocks.length < 10) {
                        return [...updatedRocks, ...generateRocks(10 - updatedRocks.length)]
                    }
                    return updatedRocks
                })
            }, 500)

            const timerInterval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(rockInterval)
                        clearInterval(timerInterval)
                        setGameEnded(true)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

            return () => {
                clearInterval(rockInterval)
                clearInterval(timerInterval)
            }
        }
    }, [gameStarted, gameEnded])

    const playSound = useCallback(
        (frequency: number) => {
            if (audioContext) {
                const oscillator = audioContext.createOscillator()
                const gainNode = audioContext.createGain()
                oscillator.type = "sine"
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
                oscillator.connect(gainNode)
                gainNode.connect(audioContext.destination)
                gainNode.gain.setValueAtTime(1, audioContext.currentTime)
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)
                oscillator.start()
                oscillator.stop(audioContext.currentTime + 0.5)
            }
        },
        [audioContext],
    )

    const handleRockClick = (id: number) => {
        let earnedPoints = 0;

        setRocks((prevRocks) => {
            return prevRocks
                .map((rock) => {
                    if (rock.id === id) {
                        const newStrength = rock.strength - 1;
                        playSound(220 + rock.strength * 30);
                        if (newStrength <= 0) {
                            earnedPoints = rock.points; // Capture points separately
                            if (earnedPoints > 0) {
                                setPoints((prev) => prev + earnedPoints / 2); // Update points outside setRocks
                            }
                            return {...rock, strength: 0};
                        }
                        return {...rock, strength: newStrength};
                    }
                    return rock;
                })
                .filter((rock) => rock.strength > 0);
        });
    };


    const handleStartGame = () => {
        setGameStarted(true)
        setTimeLeft(GAME_DURATION)
        setPoints(0)
    }

    const handleRestartGame = () => {
        setGameEnded(false)
        setGameStarted(false)
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <BackgroundScene/>
            <div className="absolute top-4 right-4 bg-white bg-opacity-70 p-2 rounded flex justify-between w-48">
                <p className="text-2xl font-semibold">Points: {points}</p>
                <p className="text-2xl font-semibold">Time: {timeLeft}</p>
            </div>
            {!gameStarted ? (
                <StartTimer onComplete={handleStartGame}/>
            ) : gameEnded ? (
                <GameEndScene points={points} onRestart={handleRestartGame}/>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    {rocks.map((rock) => (
                        <Rock key={rock.id} rock={rock} onClick={() => handleRockClick(rock.id)}/>
                    ))}
                </div>
            )}
        </div>
    )
}

