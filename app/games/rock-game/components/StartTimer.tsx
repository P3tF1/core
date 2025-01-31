import type React from "react"
import { useState, useEffect } from "react"

interface StartTimerProps {
    onComplete: () => void
}

const StartTimer: React.FC<StartTimerProps> = ({ onComplete }) => {
    const [countdown, setCountdown] = useState(3)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            onComplete()
        }
    }, [countdown, onComplete])

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Rock Breaking Game</h1>
                <p className="text-xl mb-2">Click on rocks to break them and earn points!</p>
                <p className="text-xl mb-2">Rocks will decay over time, so be quick!</p>
                <p className="text-xl">You have 60 seconds. Good luck!</p>
            </div>
            <div className="text-white text-9xl font-bold">{countdown > 0 ? countdown : "Go!"}</div>
        </div>
    )
}

export default StartTimer

