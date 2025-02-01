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
    hits: number
    maxHits: number
    size: number
    color: string
}

export interface Laser {
    x: number
    y: number
    speed: number
}

export interface GameConfig {
    meteoriteSpawnRate: number
    meteoriteSpeedBase: number
    meteoriteSpeedVariance: number
    meteoriteHitsMean: number
    meteoriteHitsStdDev: number
    laserSpeed: number
    laserFireRate: number
}

