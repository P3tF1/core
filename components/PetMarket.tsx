import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Pet } from "@/types";
import { BuyPetPopup } from "./BuyPetPopup";
import { PetForSaleCard } from "./PetForSaleCard";
import { samplePetsForTrade } from "@/constants/gameData";

export function PetMarket({
  balance,
  setBalance,
  pets,
  setPets,
  onBuyPet,
  onBuyDefaultPet,
}) {
  const [showBuyPetPopup, setShowBuyPetPopup] = useState(false);
  const [petsForSale, setPetsForSale] = useState(samplePetsForTrade);

  const buyNewPet = async () => {
    if (balance >= 100) {
      setShowBuyPetPopup(false);
      await onBuyDefaultPet();
    }
  }

  const handleBuyPet = async (petId: number) => {
    const petToBuy = petsForSale.find((pet) => pet.id === petId)
    if (petToBuy && balance >= petToBuy.price) {
      setBalance(balance - petToBuy.price)
      setPets([...pets, petToBuy])
      setPetsForSale(petsForSale.filter((pet) => pet.id !== petId))
      await onBuyPet()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Pet Market</h2>
      <div className="space-y-4">
        <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => setShowBuyPetPopup(true)}>
          Buy New Pet (100 Tokens)
        </Button>
        <h3 className="text-xl font-semibold mt-6 mb-3 text-indigo-600">Pets for Sale</h3>
        {petsForSale.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {petsForSale.map((pet) => (
              <PetForSaleCard key={pet.id} pet={pet} onBuy={() => handleBuyPet(pet.id)} balance={balance} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No pets available for sale at the moment. Please check back later!
          </p>
        )}
      </div>
      {showBuyPetPopup && <BuyPetPopup onBuy={buyNewPet} onClose={() => setShowBuyPetPopup(false)} balance={balance} />}
    </div>
  )
}

