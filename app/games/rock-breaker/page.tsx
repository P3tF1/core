"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Trophy, Timer } from "lucide-react";
import Rock from "./components/Rock";
import { generateRocks, type RockType } from "./utils/rockUtils";
import BackgroundScene from "./components/BackgroundScene";
import StartTimer from "./components/StartTimer";
import GameEndScene from "./components/GameEndScene";
import {Howler, Howl} from "howler"
import { Navbar } from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
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
const GAME_DURATION = 10;
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

export default function RockBreakingGame() {
	const [rocks, setRocks] = useState<RockType[]>([]);
	const [points, setPoints] = useState(0);
	const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
	const [gameStarted, setGameStarted] = useState(false);
	const [gameEnded, setGameEnded] = useState(false);
	const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
	const [showReward, setShowReward] = useState(false);
	const [earnedPoints, setEarnedPoints] = useState(0);
	const [pet, setPet] = useState<any>(null);
	const [balance, setBalance] = useState(0);
	const breakRock
		= new Howl({
		src: ["/rock-break.mp3"],
		volume: 0.8,
	});

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
	useEffect(() => {
		setPet(samplePetsForTrade[0]);
		setAudioContext(
			new (window.AudioContext || (window as any).webkitAudioContext)()
		);
	}, []);
	useEffect(() => {
		if (gameStarted && !gameEnded) {
			setRocks(generateRocks(10));
			const rockInterval = setInterval(() => {
				setRocks((prevRocks) => {
					const updatedRocks = prevRocks
						.map((rock) => ({
							...rock,
							decay: rock.decay - 1 - pet.level / 10,
						}))
						.filter((rock) => rock.decay > 0);

					if (updatedRocks.length < 10) {
						return [
							...updatedRocks,
							...generateRocks(10 - updatedRocks.length),
						];
					}
					return updatedRocks;
				});
			}, 500);

			const timerInterval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(rockInterval);
						clearInterval(timerInterval);
						setGameEnded(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => {
				clearInterval(rockInterval);
				clearInterval(timerInterval);
			};
		}
	}, [gameStarted, gameEnded]);

	// Sound logic remains the same
	const playSound = useCallback(
		(frequency: number) => {
			if (audioContext) {
				const oscillator = audioContext.createOscillator();
				const gainNode = audioContext.createGain();
				oscillator.type = "sine";
				oscillator.frequency.setValueAtTime(
					frequency,
					audioContext.currentTime
				);
				oscillator.connect(gainNode);
				gainNode.connect(audioContext.destination);
				gainNode.gain.setValueAtTime(1, audioContext.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(
					0.001,
					audioContext.currentTime + 0.5
				);
				oscillator.start();
				oscillator.stop(audioContext.currentTime + 0.5);
			}
		},
		[audioContext]
	);

	const handleRockClick = (id: number) => {
		breakRock.play()
		setRocks((prevRocks) => {
			return prevRocks
				.map((rock) => {
					if (rock.id === id) {
						const breakMultiplier = 1 + pet.strength / 10;
						const newStrength = rock.strength - Math.ceil(breakMultiplier);
						if (newStrength <= 0) {
							const points = rock.points;
							setEarnedPoints(points / 2);
							setShowReward(true);
							setTimeout(() => setShowReward(false), 1000);
							setPoints((prev) => prev + points / 2);
							return { ...rock, strength: 0 };
						}
						return { ...rock, strength: newStrength };
					}
					return rock;
				})
				.filter((rock) => rock.strength > 0);
		});
	};

	const handleStartGame = () => {
		setGameStarted(true);
		setTimeLeft(GAME_DURATION);
		setPoints(0);
	};

	const handleRestartGame = () => {
		setGameEnded(false);
		setBalance(balance + points / 5);
		setGameStarted(false);
	};

	return (
		<div>
			{" "}
			<Navbar balance={balance} />
			<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-zinc-900 p-6">
				<div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
					<div className="flex-1 space-y-6">
						{/* Stats Bar */}
						<div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
									<Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
									<div>
										<div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
											Points
										</div>
										<div className="text-2xl font-bold">{points}</div>
									</div>
								</div>
								<div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
									<Timer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
									<div>
										<div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
											Time
										</div>
										<div className="text-2xl font-bold">{timeLeft}s</div>
									</div>
								</div>
								{showReward && (
									<div className="absolute top-4 right-4 animate-bounce bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-lg flex items-center gap-2">
										<Trophy className="w-5 h-5" />
										<span>+{earnedPoints} points!</span>
									</div>
								)}
							</div>
						</div>

						{/* Game Container */}
						<div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900 relative min-h-[600px]">
							<div className="absolute inset-0 rounded-xl overflow-hidden">
								<BackgroundScene />
								{!gameStarted ? (
									<StartTimer onComplete={handleStartGame} />
								) : gameEnded ? (
									<GameEndScene points={points} onRestart={handleRestartGame} />
								) : (
									<div className="absolute inset-0 flex items-center justify-center">
										{rocks.map((rock) => (
											<Rock
												key={rock.id}
												rock={rock}
												onClick={() => handleRockClick(rock.id)}
											/>
										))}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Pet Panel */}
					<PetPanel pet={pet} />
				</div>
			</div>
		</div>
	);
}

function PetPanel({ pet }) {
	const [isImageLoading, setIsImageLoading] = useState(true);
	if (!pet) return null;
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
						alt={`${pet.name} - Level ${pet.level} Dragon`}
						className="object-cover rounded-full"
						width={96}
						height={48}
						onLoadingComplete={() => setIsImageLoading(false)}
						onError={() => setIsImageLoading(false)}
						priority
					/>				</div>
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
					label="Strength"
					value={pet.strength}
					max={20}
					color="bg-red-500"
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
