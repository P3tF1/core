import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"


export function FeedPopup({ pet, foodBag, onFeed, onClose }: FeedPopupProps) {
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
        <h3 className="text-2xl font-bold mb-4 text-indigo-600">Feed {pet.name}</h3>
        {foodBag && foodBag.length > 0 ? (
          <div className="space-y-4">
            {foodBag.map((food, index) => (
              <Button
                key={index}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={() => onFeed(food, pet)}
              >
                {food.name} (x{food.quantity})
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No food available in your food bag.</p>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white" onClick={onClose}>
              Go to Food Shop
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

