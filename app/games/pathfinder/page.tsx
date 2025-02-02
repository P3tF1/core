"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Brain, Coins } from "lucide-react";
import PathfinderGame from "./components/PathfinderGame";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
// import { useSearchParams } from "next/navigation";
import {testImageLink} from "@/constants/gameData";
import {showToast} from "@/utils/toast";
import {ethers} from "ethers";
import NftGeneratortAddress from "@/contract_address/nft_generator_address.json";
import NftGeneratorABI from "@/contract_abis/nft_generator_abi.json";
import {useAppKitAccount} from "@reown/appkit/react";
import TokenAddress from "@/contract_address/p3tf1_coin_address.json";
import TokenABI from "@/contract_abis/p3tf1_coin_abi.json";
import type {Pet} from "@/types";
import {number} from "zod";
import Image from "next/image";

const samplePetsForTrade = [
	{
		id: 1,
		name: "Luna",
		type: "Dragon",
		level: 8,
		strength: 15,
		intelligence: 18,
		icon: "🦄",
		price: 500,
	},
	{
		id: 2,
		name: "Rex",
		type: "Dragon",
		level: 10,
		strength: 20,
		intelligence: 12,
		icon: "🦖",
		price: 750,
	},
	{
		id: 3,
		name: "Nessie",
		type: "Dragon",
		level: 12,
		strength: 18,
		intelligence: 16,
		icon: "🐉",
		price: 1000,
	},
];

export default function Home() {
	const [pet, setPet] = useState<any | null>(null);
	const [coinsWon, setCoins] = useState(0);
	const [showReward, setShowReward] = useState(false);
	const [earnedCoins, setEarnedCoins] = useState(0);
	// const searchParams = useSearchParams();
	const [balance, setBalance] = useState(0);

	const searchParams = useSearchParams();
	const variable = searchParams.get("pet"); // Extracts "variable"
	console.log(variable)
	const [petName, setPetName] = useState("");
	const [petLevel, setPetLevel] = useState(0);
	const [petStrength, setPetStrength] = useState(0);

	const [pets, setPets] = useState<Pet[]>([]);
	const { address, isConnected } = useAppKitAccount();
	const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(
		null
	);
	const [nftGenerator, setNftGenerator] = useState<ethers.Contract | null>(
		null
	);
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


	useEffect(() => {
		if (isConnected) {
			getTokenBalance();
			findPet();
			console.log("I am on");
		}
	}, [isConnected]);

	const getTokenBalance = async () => {
		const tokenContract = await getTokenContract();
		if (!tokenContract) {
			return;
		}
		const balance = await tokenContract.balanceOf(address);
		const formattedBalance = ethers.formatEther(balance);
		setBalance(Number(formattedBalance));
	};

	const getTokenContract = async () => {
		if (!isConnected) {
			showToast.error("Wallet not connected");
			return null;
		}
		if (tokenContract) {
			return tokenContract;
		}
		try {
			const ethersProvider = new ethers.BrowserProvider(window.ethereum);
			const signer = await ethersProvider.getSigner();

			const contract = new ethers.Contract(
				TokenAddress.address,
				TokenABI,
				signer
			);
			setTokenContract(contract);
			return contract;
		} catch (error) {
			showToast.error("Failed to fetch contract: " + error.message);
			return null;
		}
	};

	const getNftGenContract = async () => {
		if (!isConnected) {
			showToast.error("Wallet not connected");
			return null;
		}
		if (nftGenerator) {
			return nftGenerator;
		}
		try {
			const ethersProvider = new ethers.BrowserProvider(window.ethereum);
			const signer = await ethersProvider.getSigner();

			const contract = new ethers.Contract(
				NftGeneratortAddress.address,
				NftGeneratorABI,
				signer
			);
			setNftGenerator(contract);
			return contract;
		} catch (error) {
			showToast.error("Failed to fetch contract: " + error.message);
			return null;
		}
	};

	const findPet = async () => {
		const contract = await getNftGenContract();
		if (contract == null) return;
		const nftIds = await contract.getUserNFTs(address);
		console.log("User's NFT IDs:", nftIds);

		const finalPetsArray = [];
		for (const tokenId of nftIds) {
			const nftDetails = await contract.getNFTDetails(tokenId);
			finalPetsArray.push({
				id: tokenId.toString(),
				name: nftDetails.name,
				level: nftDetails.level.toString(),
				strength: nftDetails.strength.toString(),
				intelligence: nftDetails.intelligence.toString(),
				image: nftDetails.imageLink || testImageLink,
				type: nftDetails.xP.toString(),
			})
			console.log(tokenId)
			if (tokenId.toString() == variable) {
				setPetName(nftDetails.name);
				setPetLevel(nftDetails.level);
				setPetStrength(nftDetails.strength);
				console.log(petName, petLevel, petStrength);
				setPet({
					id: tokenId.toString(),
					name: nftDetails.name,
					level: nftDetails.level.toString(),
					strength: nftDetails.strength.toString(),
					intelligence: nftDetails.intelligence.toString(),
					image: nftDetails.imageLink || testImageLink,
					type: nftDetails.xP.toString(),
				});
			}
		}
		console.log("Here");
		console.log(finalPetsArray);
		setPets(finalPetsArray);
		return finalPetsArray;
	};

	// useEffect(() => {
	// 	const fetchPetDetails = async () => {
	// 		try {
	// 			// Get the pet ID from URL
	// 			const petParam = searchParams.get("pet");
	// 			if (!petParam) {
	// 				throw new Error("No pet ID provided");
	// 			}
	//
	// 			const petId = JSON.parse(petParam);
	//
	// 			// Find the pet in our sample data
	// 			const foundPet = samplePetsForTrade.find((p) => p.id === petId);
	// 			if (!foundPet) {
	// 				throw new Error("Pet not found");
	// 			}
	//
	// 			setPet(foundPet);
	// 		} catch (error) {
	// 			console.error("Error fetching pet details:", error);
	// 			setPet({
	// 				name: "Fluffy",
	// 				type: "Dragon",
	// 				level: 5,
	// 				strength: 10,
	// 				intelligence: 8,
	// 				icon: "🐉",
	// 			});
	// 		}
	// 	};
	//
	// 	fetchPetDetails();
	// }, [searchParams]);

	const handleGameComplete = (score: number) => {
		const newCoins = Math.floor(score / 10);
		setEarnedCoins(newCoins);
		setShowReward(true);
		setTimeout(() => {
			setShowReward(false);
			setCoins((prevCoins) => prevCoins + newCoins);
		}, 2000);
	};

	if (!pet) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
					<span className="text-purple-600 dark:text-purple-400 font-medium">
						Loading...
					</span>
				</div>
			</div>
		);
	}

	return (
		<div>
			<Navbar balance={balance} />

			<main className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-zinc-900 p-6">
				<div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
					<div className="flex-1 space-y-6">
						{/* Stats Bar */}
						<div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
									<Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
									<div>
										<div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
											Level
										</div>
										<div className="text-2xl font-bold">{pet.level}</div>
									</div>
								</div>
								<div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
									<Coins className="w-5 h-5 text-purple-600 dark:text-purple-400" />
									<div>
										<div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
											Coins Won
										</div>
										<div className="text-2xl font-bold">{coinsWon}</div>
									</div>
								</div>
								{showReward && (
									<div className="absolute top-4 right-4 animate-bounce bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-lg flex items-center gap-2">
										<Trophy className="w-5 h-5" />
										<span>+{earnedCoins} coins!</span>
									</div>
								)}
							</div>
						</div>

						{/* Game Container */}
						<div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900">
							<PathfinderGame
								level={pet.level}
								onGameComplete={handleGameComplete}
							/>
						</div>
					</div>

					{/* Pet Panel */}
					<PetPanel pet={pet} />
				</div>
			</main>
		</div>
	);
}

function PetPanel({ pet }) {
	const [isImageLoading, setIsImageLoading] = useState(true);
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
		<aside className="lg:w-80 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900 sticky top-6 self-start">
			<h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-6">
				Pet Details
			</h3>
			<div className="flex flex-col items-center mb-6">
				<div className="w-24 h-24 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
					<Image
						src={getImageUrl(pet)|| testImageLink}
						alt={`${pet.name} - Level ${pet.level} ${pet.type}`}
						className="object-cover rounded-full"
						width={96}
						height={48}
						onLoadingComplete={() => setIsImageLoading(false)}
						onError={() => setIsImageLoading(false)}
						priority
					/>
				</div>
				<h4 className="text-xl font-bold mb-1">{pet.name}</h4>
				<p className="text-gray-600 dark:text-gray-400">Dragon</p>
			</div>

			<div className="space-y-4">
				<StatBar
					label="Level"
					value={pet.level}
					max={20}
					color="bg-green-500"
				/>
				<StatBar
					label="Intelligence"
					value={pet.intelligence}
					max={20}
					color="bg-blue-500"
				/>
			</div>
		</aside>
	);
}

function StatBar({ label, value, max, color }) {
	const percentage = (value / max) * 100;
	return (
		<div className="group">
			<div className="flex justify-between text-sm font-medium mb-2">
				<span>{label}</span>
				<span className="text-gray-600 dark:text-gray-400">
					{value}/{max}
				</span>
			</div>
			<div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
				<div
					className={`h-full ${color} transition-all duration-500 ease-out group-hover:opacity-90`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}
