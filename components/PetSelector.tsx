import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Pet } from "@/types";

interface PetSelectorProps {
	pets: Pet[];
	onSelectPet: (pet: Pet) => void;
}

export function PetSelector({ pets, onSelectPet }: PetSelectorProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handlePrevious = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + pets.length) % pets.length);
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % pets.length);
	};

	const currentPet = pets[currentIndex];

	if (pets.length === 0) {
		return (
			<div className="text-center p-4 bg-red-100 rounded-lg">
				<p className="text-red-600 font-semibold">
					You don't have any pets to play with!
				</p>
				<p className="text-red-500">
					Visit the Pet Market to get your first pet.
				</p>
			</div>
		);
	}

	const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

	const getImageUrl = (pet: Pet) => {
		if (!IMAGE_URL) return testImageLink;
		return IMAGE_URL.replace("[Type]", encodeURIComponent("Dragon"))
			.replace("[Level]", encodeURIComponent(pet.level.toString()))
			.replace("[Strength]", encodeURIComponent(pet.strength.toString()))
			.replace(
				"[Intelligence]",
				encodeURIComponent(pet.intelligence.toString())
			);
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md">
			<h3 className="text-lg font-semibold mb-4 text-center">
				Choose Your Pet
			</h3>
			<div className="flex items-center justify-between">
				<Button variant="outline" size="icon" onClick={handlePrevious}>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<motion.div
					key={currentPet.id}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className="flex flex-col items-center"
				>
					<Image
						src={getImageUrl(currentPet) || "/placeholder.svg"}
						alt={currentPet.name}
						width={100}
						height={100}
						className="rounded-full mb-2"
					/>
					<h4 className="font-semibold">{currentPet.name}</h4>
					<p className="text-sm text-gray-600">
						Level {currentPet.level} {currentPet.type}
					</p>
				</motion.div>
				<Button variant="outline" size="icon" onClick={handleNext}>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
			<Button
				className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
				onClick={() => onSelectPet(currentPet)}
			>
				Play with {currentPet.name}
			</Button>
		</div>
	);
}
