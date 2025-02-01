import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuyPetPopupProps {
	onBuy: () => void;
	onClose: () => void;
	balance: number;
}

export function BuyPetPopup({ onBuy, onClose, balance }: BuyPetPopupProps) {
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
				<h3 className="text-2xl font-bold mb-4 text-indigo-600">Buy New Pet</h3>
				<p className="text-gray-600 mb-4">
					Are you sure you want to buy a new pet for 100 Tokens? Your new pet
					will start at level 1 with basic stats.
				</p>
				<Button
					className="w-full bg-green-500 hover:bg-green-600 text-white mb-2"
					onClick={onBuy}
					disabled={balance < 100}
				>
					{balance < 100 ? "Not enough tokens" : "Buy Pet"}
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
