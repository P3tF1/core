import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Game, Pet } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";


interface GamePopupProps {
  game: Game;
  pet: Pet;
  onClose: () => void;
}

export function GamePopup({ game, pet, onClose }: GamePopupProps) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-md w-full relative"
      >
        <Button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
        <h3 className="text-2xl font-bold mb-2 text-indigo-600">{game.name}</h3>
        <div className="flex items-center mb-4">
          <Image
            src={pet.image || "/placeholder.svg"}
            alt={pet.name}
            width={50}
            height={50}
            className="rounded-full mr-3"
          />

          <div>
            <p className="font-semibold">{pet.name}</p>

            <p className="text-sm text-gray-600">
              Level {pet.level} Dragon
            </p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{game.description}</p>
        <h4 className="font-semibold mb-2">Strategy:</h4>
        <p className="text-gray-600 mb-4">{game.strategy}</p>
        <h4 className="font-semibold mb-2">Benefits:</h4>
        <p className="text-gray-600 mb-4">{game.benefits}</p>
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => {
            const url = `${game.url}?pet=${pet.id}`;
            router.push(url);
          }}
        >
          Play Now
        </Button>
      </motion.div>
    </motion.div>
  );
}
