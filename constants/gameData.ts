import { Brain, Dumbbell, ShoppingBag } from "lucide-react"

export const testImageLink =
  "https://fastly.picsum.photos/id/728/200/300.jpg?hmac=J-q7xv6gzVRQmKunEBaFotw4F0dJ1Q6OnjN85VoBk8o"

export const games = [
  {
    name: "Speed Math Challenge",
    description: "Test your math skills in a fast-paced environment!",
    strategy: "Focus on quick mental calculations and pattern recognition.",
    benefits: "Improves your pet's intelligence and reaction time.",
    icon: Brain,
  },
  {
      name: "Card Flip Challenge",
      description: "Match pairs of cards in the shortest time possible!",
      strategy: "Memorize card positions and use logical deduction.",
      benefits: "Enhances your pet's memory and cognitive abilities.",
      icon: Dumbbell,
    },
    {
        name: "Rock Breaker",
        description: "Break as many rocks as you can before time runs out!",
        strategy: "Develop a rhythm and aim for combos to maximize points.",
        benefits: "Boosts your pet's strength and endurance.",
        icon: ShoppingBag,
    },
]

export const samplePetsForTrade = [
  {
    id: 101,
    name: "Luna",
    type: "Unicorn",
    level: 8,
    strength: 15,
    intelligence: 18,
    image: testImageLink,
    price: 500,
  },
  {
    id: 102,
    name: "Rex",
    type: "T-Rex",
    level: 10,
    strength: 20,
    intelligence: 12,
    image: testImageLink,
    price: 750,
  },
  {
    id: 103,
    name: "Nessie",
    type: "Sea Monster",
    level: 12,
    strength: 18,
    intelligence: 16,
    image: testImageLink,
    price: 1000,
  },
]


