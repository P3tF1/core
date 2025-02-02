import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BuyPetPopupProps {
	onBuy: (name: string) => void;
	onClose: () => void;
	balance: number;
}

export function BuyPetPopup({ onBuy, onClose, balance }: BuyPetPopupProps) {
	const [name, setName] = useState("");
	const [showConfirm, setShowConfirm] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			setShowConfirm(true);
		}
	};

	const handleConfirmBuy = () => {
		onBuy(name);
	};

	if (showConfirm) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
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
						onClick={() => setShowConfirm(false)}
					>
						<X className="w-4 h-4" />
					</Button>

					<h3 className="text-xl font-bold mb-4 text-indigo-600">
						Confirm Purchase
					</h3>
					<p className="text-gray-600 mb-4">
						Are you sure you want to buy a new Dragon named {name} for 100
						Tokens? Your new pet will start at level 1 with basic stats.
					</p>

					<Button
						className="w-full bg-green-500 hover:bg-green-600 text-white mb-2"
						onClick={handleConfirmBuy}
						disabled={balance < 100}
					>
						{balance < 100 ? "Not enough tokens" : "Confirm Purchase"}
					</Button>
					<Button
						className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800"
						onClick={() => setShowConfirm(false)}
					>
						Back
					</Button>
				</motion.div>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
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
					<X className="w-4 h-4" />
				</Button>

				<h3 className="text-xl font-bold mb-6 text-indigo-600">
					Create New Pet
				</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="pet-name">Pet Name</Label>
						<Input
							id="pet-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your pet's name"
							className="w-full"
							required
						/>
					</div>


					<Button
						type="submit"
						className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mb-2"
						disabled={!name.trim() || balance < 100}
					>
						{balance < 100 ? "Not enough tokens" : "Next"}
					</Button>
				</form>
			</motion.div>
		</motion.div>
	);
}
