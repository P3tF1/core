import { useState } from "react";
import { motion } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pet } from "@/types";

interface SellPetPopupProps {
	pet: Pet;
	onSell: (petId: number, price: number) => void;
	onClose: () => void;
}

export function SellPetPopup({ pet, onSell, onClose }: SellPetPopupProps) {
	const [price, setPrice] = useState(100);

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
				<h3 className="text-2xl font-bold mb-4 text-indigo-600">
					Sell {pet.name}
				</h3>
				<p className="text-gray-600 mb-4">
					Set a price for your pet. Remember, higher level pets with better
					stats are worth more!
				</p>
				<div className="flex items-center justify-between mb-4">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setPrice(Math.max(1, price - 10))}
					>
						<Minus className="w-4 h-4" />
					</Button>
					<span className="text-2xl font-bold">{price} Tokens</span>
					<Button
						variant="outline"
						size="icon"
						onClick={() => setPrice(price + 10)}
					>
						<Plus className="w-4 h-4" />
					</Button>
				</div>
				<Button
					className="w-full bg-indigo-500 hover:bg-indigo-600 text-white mb-2"
					onClick={() => onSell(pet.id, price)}
				>
					List Pet for Sale
				</Button>
				<Button
					className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800"
					onClick={onClose}
				>
					Cancel
				</Button>
			</motion.div>
		</motion.div>
	);
}
