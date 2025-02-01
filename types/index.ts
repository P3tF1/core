import type React from "react"

export interface Pet {
  id: number
  name: string
  type: string
  level: number
  strength: number
  intelligence: number
  image: string
}

export interface FoodItem {
  id: number
  name: string
  price: number
  strength: number
  intelligence: number
}

export interface FoodBagItem extends FoodItem {
  quantity: number
}

export interface Game {
  name: string
  description: string
  strategy: string
  benefits: string
  icon: React.ComponentType<{ className?: string }>
}

