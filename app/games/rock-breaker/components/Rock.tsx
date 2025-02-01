import type React from "react"
import type { RockType } from "../utils/rockUtils"

interface RockProps {
    rock: RockType
    onClick: () => void
}

const Rock: React.FC<RockProps> = ({ rock, onClick }) => {
    const { strength, maxStrength, decay, maxDecay, color, size } = rock
    const crackIntensity = 1 - strength / maxStrength
    const decayOpacity = decay / maxDecay

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            onClick={onClick}
            className="cursor-pointer transition-transform transform hover:scale-105 absolute select-none"
            style={{
                top: `${rock.posY}%`,
                left: `${rock.posX}%`,
            }}
        >
            <defs>
                <radialGradient id={`rockGradient${rock.id}`}>
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} />
                </radialGradient>
                <filter id={`crackFilter${rock.id}`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale={crackIntensity * 10} />
                </filter>
                <filter id={`roughness${rock.id}`}>
                    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
                    <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="5" />
                </filter>
            </defs>
            <circle
                cx="50"
                cy="50"
                r="45"
                fill={`url(#rockGradient${rock.id})`}
                filter={`url(#crackFilter${rock.id}) url(#roughness${rock.id})`}
                opacity={decayOpacity}
            />
            <text x="50" y="55" textAnchor="middle" fill="white" fontSize="20" filter="url(#roughness)" pointerEvents="none">
                {rock.points}
            </text>
        </svg>
    )
}

export default Rock

