import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Pet } from "@/types"
import { AttributeBar } from "./AttributeBar"
import { SellPetPopup } from "./SellPetPopup"
import Image from "next/image"

interface PetCardProps {
  pets: Pet[]
  currentPetIndex: number
  setCurrentPetIndex: (index: number) => void
  setShowFeedPopup: (show: boolean) => void
  onSellPet: (petId: number, price: number) => void
}

export function PetCard({ pets, currentPetIndex, setCurrentPetIndex, setShowFeedPopup, onSellPet }: PetCardProps) {
  const [showSellPopup, setShowSellPopup] = useState(false)

  if (pets.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Your Pets</h2>
        <p className="text-gray-600 text-center">No pets available. Visit the Pet Market to get your first pet!</p>
      </motion.div>
    )
  }

  const pet = pets[currentPetIndex]

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6 overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-600">Your Pets</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPetIndex((currentPetIndex - 1 + pets.length) % pets.length)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            {currentPetIndex + 1} / {pets.length}
          </span>
          <Button variant="outline" size="icon" onClick={() => setCurrentPetIndex((currentPetIndex + 1) % pets.length)}>
            <ChevronRight className="h-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative w-full md:w-1/2 h-64 md:h-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={pet.image || "/placeholder.svg"}
                alt={pet.name}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-semibold">{pet.name}</h3>
            <p className="text-gray-600 text-lg">
              Level {pet.level} {pet.type}
            </p>
          </div>
          <div className="space-y-2">
            <AttributeBar label="Strength" value={pet.strength} />
            <AttributeBar label="Intelligence" value={pet.intelligence} />
          </div>
          <div className="flex space-x-2">
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              onClick={() => setShowFeedPopup(true)}
            >
              Feed Pet
            </Button>
            <Button
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white"
              onClick={() => setShowSellPopup(true)}
            >
              Sell Pet
            </Button>
          </div>
        </div>
      </div>
      {showSellPopup && <SellPetPopup pet={pet} onSell={onSellPet} onClose={() => setShowSellPopup(false)} />}
    </motion.div>
  )
}

