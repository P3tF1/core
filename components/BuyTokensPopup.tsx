import { motion } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuyTokensPopupProps {
	tokensToBuy: number;
	setTokensToBuy: (tokens: number) => void;
	onBuy: () => void;
	onClose: () => void;
}

export function BuyTokensPopup({
	tokensToBuy,
	setTokensToBuy,
	onBuy,
	onClose,
}: BuyTokensPopupProps) {
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
				<h3 className="text-2xl font-bold mb-4 text-indigo-600">Buy Tokens</h3>
				<div className="flex items-center justify-between mb-4">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setTokensToBuy(Math.max(0, tokensToBuy - 1000))}
					>
						<Minus className="w-4 h-4" />
					</Button>
					<span className="text-2xl font-bold">{tokensToBuy}</span>
					<Button
						variant="outline"
						size="icon"
						onClick={() => setTokensToBuy(tokensToBuy + 1000)}
					>
						<Plus className="w-4 h-4" />
					</Button>
				</div>
				<p className="text-center mb-4">Total: {tokensToBuy * 0.000001} Eth</p>
				<Button
					className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
					onClick={onBuy}
				>
					Buy Tokens
				</Button>
			</motion.div>
		</motion.div>
	);
}
