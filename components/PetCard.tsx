"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SellPetPopup } from "./SellPetPopup";
import { FeedPopup } from "./FeedPopup";
import Image from "next/image";
import { testImageLink } from "@/constants/gameData";
import type { Pet } from "@/types";

interface PetCardProps {
	pets: Pet[];
	currentPetIndex: number;
	setCurrentPetIndex: (index: number) => void;
	onSellPet: (pet: Pet, price: number) => void;
	onFeedPet: (foodItem: any, pet: Pet) => void;
	foodBag: any[];
}

export function PetCard({ pets, onSellPet, onFeedPet, foodBag }: PetCardProps) {
	const [selectedPetForSale, setSelectedPetForSale] = useState<Pet | null>(
		null
	);
	const [selectedPetForFeed, setSelectedPetForFeed] = useState<Pet | null>(
		null
	);
	const [imageKeys, setImageKeys] = useState<{ [key: string]: number }>({});
	const [isImageLoading, setIsImageLoading] = useState<{
		[key: string]: boolean;
	}>({});

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

	if (pets.length === 0) {
		return (
			<div className="max-w-6xl mx-auto bg-indigo-900/90 backdrop-blur-lg rounded-2xl shadow-lg p-6">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-bold text-white">Your Pets</h2>
					<div className="relative w-32 h-32 mx-auto">
						<Image
							src={testImageLink}
							alt="Empty pet slot"
							width={128}
							height={128}
							className="rounded-lg opacity-40"
						/>
					</div>
					<p className="text-white">
						No pets available. Visit the Pet Market to get your first pet!
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{pets.map((pet, index) => (
					<motion.div
						key={`${pet.id}-${index}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
						className="bg-indigo-900/90 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-indigo-400/20"
					>
						<div className="relative">
							<AnimatePresence mode="wait">
								<motion.div
									key={`${pet.id}-${imageKeys[pet.id] || 0}`}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="relative"
								>
									{isImageLoading[pet.id] && (
										<div className="absolute inset-0 flex items-center justify-center bg-indigo-950/80">
											<div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
										</div>
									)}
									<div className="relative aspect-square bg-indigo-950/80">
										<Image
											src={getImageUrl(pet)}
											alt={`${pet.name} - Level ${pet.level} Dragon`}
											fill
											className="object-cover"
											onLoadingComplete={() =>
												setIsImageLoading((prev) => ({
													...prev,
													[pet.id]: false,
												}))
											}
											onError={() =>
												setIsImageLoading((prev) => ({
													...prev,
													[pet.id]: false,
												}))
											}
											priority
										/>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="absolute top-2 right-2 bg-black/50 hover:bg-black/60 text-white"
										onClick={() => {
											setImageKeys((prev) => ({
												...prev,
												[pet.id]: (prev[pet.id] || 0) + 1,
											}));
											setIsImageLoading((prev) => ({
												...prev,
												[pet.id]: true,
											}));
										}}
									>
										<RefreshCw className="h-4 w-4" />
									</Button>
								</motion.div>
							</AnimatePresence>
						</div>

						<div className="p-4 space-y-4">
							<div>
								<h3 className="text-xl font-bold text-white">{pet.name}</h3>
								<p className="text-indigo-100">Level {pet.level} Dragon</p>
							</div>

							<div className="space-y-3">
								<div>
									<div className="flex justify-between text-white mb-1">
										<span>Strength</span>
										<span>{pet.strength}</span>
									</div>
									<div className="h-2 bg-indigo-950/80 rounded-full">
										<motion.div
											className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
											initial={{ width: 0 }}
											animate={{
												width: `${(parseInt(pet.strength) / 100) * 100}%`,
											}}
										/>
									</div>
								</div>

								<div>
									<div className="flex justify-between text-white mb-1">
										<span>Intelligence</span>
										<span>{pet.intelligence}</span>
									</div>
									<div className="h-2 bg-indigo-950/80 rounded-full">
										<motion.div
											className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
											initial={{ width: 0 }}
											animate={{
												width: `${((pet.intelligence) / 100) * 100}%`,
											}}
										/>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<button
									className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all"
									onClick={() => setSelectedPetForFeed(pet)}
								>
									Feed Pet
								</button>
								<button
									className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
									onClick={() => setSelectedPetForSale(pet)}
								>
									Sell Pet
								</button>
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{selectedPetForSale && (
				<SellPetPopup
					pet={selectedPetForSale}
					onSell={onSellPet}
					onClose={() => setSelectedPetForSale(null)}
				/>
			)}

			{selectedPetForFeed && (
				<FeedPopup
					pet={selectedPetForFeed}
					foodBag={foodBag}
					onFeed={onFeedPet}
					onClose={() => setSelectedPetForFeed(null)}
				/>
			)}
		</div>
	);
}

export default PetCard;
