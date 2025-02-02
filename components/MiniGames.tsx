import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Game, Pet } from "@/types";
import { games } from "@/constants/gameData";
import { PetSelector } from "./PetSelector";
import { useState } from "react";

interface MiniGamesProps {
  setSelectedGame: (game: Game | null) => void;
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
}

export function MiniGames({
  setSelectedGame,
  pets,
  onSelectPet,
}: MiniGamesProps) {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet);
    onSelectPet(pet);
  };

  const handleSelectGame = (game: Game) => {
    if (selectedPet) {
      setSelectedGame(game);
    } else {
      alert("Please select a pet first!");
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Mini-Games</h2>
      <PetSelector pets={pets} onSelectPet={handleSelectPet} />
      {selectedPet && (
        <>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-indigo-600">
            Available Games
          </h3>
          {games.length > 0 ? (
            <div className="space-y-4">
              {games.map((game, index) => (
                <GameItem key={index} game={game} onSelect={handleSelectGame} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No mini-games available at the moment. Please check back later!
            </p>
          )}
        </>
      )}
    </div>
  );
}

interface GameItemProps {
  game: Game;
  onSelect: (game: Game) => void;
}

function GameItem({ game, onSelect }: GameItemProps) {
  return (
    <motion.div
      className="bg-indigo-50 p-4 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(game)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <game.icon className="w-8 h-8" />
          <h3 className="font-semibold">{game.name}</h3>
        </div>
        <ChevronDown className="w-5 h-5 text-indigo-600" />
      </div>
    </motion.div>
  );
}
