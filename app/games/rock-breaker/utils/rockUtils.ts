export interface RockType {
    id: number
    strength: number
    maxStrength: number
    decay: number
    maxDecay: number
    points: number
    posX: number
    posY: number
    color: string
    size: number
}

const rockColors = [
    "#8B4513", // Saddle Brown
    "#A0522D", // Sienna
    "#CD853F", // Peru
    "#D2691E", // Chocolate
    "#DEB887", // Burlywood
]

function gaussianRandom(mean: number, stdDev: number): number {
    let u = 0,
        v = 0
    while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    num = num * stdDev + mean // Translate to desired mean and standard deviation
    return Math.round(Math.max(1, Math.min(10, num))) // Ensure it's between 1 and 10
}

export function generateRocks(count: number): RockType[] {
    return Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        strength: Math.floor(Math.random() * 5) + 3,
        maxStrength: Math.floor(Math.random() * 5) + 3,
        decay: Math.floor(Math.random() * 15) + 10,
        maxDecay: Math.floor(Math.random() * 15) + 10,
        points: gaussianRandom(5, 2), // Mean of 5, standard deviation of 2
        posX: Math.random() * 80 + 10,
        posY: Math.random() * 80 + 10,
        color: rockColors[Math.floor(Math.random() * rockColors.length)],
        size: Math.floor(Math.random() * 40) + 60, // Random size between 60 and 100
    }))
}

