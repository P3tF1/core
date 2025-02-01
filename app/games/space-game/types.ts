export interface GameState {
    level: number
    score: number
    playerStrength: number
    playerIntelligence: number
    gameOver: boolean
    countdown: number
}

export interface Spaceship {
    x: number
    y: number
    width: number
    height: number
}

export interface Meteorite {
    x: number
    y: number
    speed: number
    strength: number
    size: number
}

export interface Laser {
    x: number
    y: number
    speed: number
}

