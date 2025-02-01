/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import {
	X,
	Plus,
	Minus,
	PawPrint,
	ShoppingBag,
	Gamepad2,
	ChevronLeft,
	ChevronRight,
	Coins,
	Brain,
	Dumbbell,
	ChevronDown,
	ShoppingCart,
	Map,
} from "lucide-react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import TokenABI from "@/contract_abis/p3tf1_coin_abi.json";
import NftGeneratorABI from "@/contract_abis/nft_generator_abi.json";
import NftMarketplaceABI from "@/contract_abis/nft_marketplace_abi.json";
import NftMarketplaceAddress from "@/contract_address/nft_marketplace_address.json";
import NftGeneratortAddress from "@/contract_address/nft_generator_address.json";
import TokenAddress from "@/contract_address/p3tf1_coin_address.json";
import { toast } from "react-hot-toast";
import { url } from "inspector";

const games = [
	{
		name: "Speed Math Challenge",
		description: "Test your math skills in a fast-paced environment!",
		strategy: "Focus on quick mental calculations and pattern recognition.",
		benefits: "Improves your pet's intelligence and reaction time.",
		icon: <Brain className="w-8 h-8" />,
		url: "/games/speed-math",
	},
	{
		name: "Card Flip Challenge",
		description: "Match pairs of cards in the shortest time possible!",
		strategy: "Memorize card positions and use logical deduction.",
		benefits: "Enhances your pet's memory and cognitive abilities.",
		icon: <Dumbbell className="w-8 h-8" />,
		url: "/games/card-flip",
	},
	{
		name: "Rock Breaker",
		description: "Break as many rocks as you can before time runs out!",
		strategy: "Develop a rhythm and aim for combos to maximize points.",
		benefits: "Boosts your pet's strength and endurance.",
		icon: <ShoppingBag className="w-8 h-8" />,
		url: "/games/rock-breaker",
	},
	{
		name: "Pathfinder",
		description: "Navigate the maze and reach the goal as quickly as possible!",
		strategy: "Plan your moves efficiently and use the shortest path to win.",
		benefits: "Enhances problem-solving skills and spatial awareness.",
		icon: <Map className="w-8 h-8" />,
		url: "/games/pathfinder",
	},
];

const foodItems = [
	{ name: "Basic Kibble", price: 5, strength: 1, intelligence: 1 },
	{ name: "Premium Chow", price: 10, strength: 2, intelligence: 2 },
	{ name: "Gourmet Feast", price: 20, strength: 3, intelligence: 3 },
];

const samplePetsForTrade = [
	{
		id: 1,
		name: "Luna",
		type: "Unicorn",
		level: 8,
		strength: 15,
		intelligence: 18,
		icon: "🦄",
		price: 500,
	},
	{
		id: 2,
		name: "Rex",
		type: "T-Rex",
		level: 10,
		strength: 20,
		intelligence: 12,
		icon: "🦖",
		price: 750,
	},
	{
		id: 3,
		name: "Nessie",
		type: "Sea Monster",
		level: 12,
		strength: 18,
		intelligence: 16,
		icon: "🐉",
		price: 1000,
	},
];

export default function Dashboard() {
	const [balance, setBalance] = useState(0);
	const [selectedGame, setSelectedGame] = useState(null);
	const [showBuyTokens, setShowBuyTokens] = useState(false);
	const [tokensToBuy, setTokensToBuy] = useState(0);
	const [pets, setPets] = useState([
		{
			id: 1,
			name: "Fluffy",
			type: "Dragon",
			level: 5,
			strength: 10,
			intelligence: 8,
			icon: "🐉",
		},
		{
			id: 2,
			name: "Spike",
			type: "Dinosaur",
			level: 3,
			strength: 15,
			intelligence: 5,
			icon: "🦖",
		},
		{
			id: 3,
			name: "Whiskers",
			type: "Cat",
			level: 7,
			strength: 6,
			intelligence: 12,
			icon: "🐱",
		},
	]);
	const [selectedPet, setSelectedPet] = useState(pets[0]);
	const [currentPetIndex, setCurrentPetIndex] = useState(0);
	const [foodBag, setFoodBag] = useState([
		{ name: "Basic Kibble", quantity: 5, strength: 1, intelligence: 1 },
		{ name: "Premium Chow", quantity: 3, strength: 2, intelligence: 2 },
		{ name: "Gourmet Feast", quantity: 1, strength: 3, intelligence: 3 },
	]);
	const [showFeedPopup, setShowFeedPopup] = useState(false);
	const [activeSection, setActiveSection] = useState("pets");
	const [petsForSale, setPetsForSale] = useState(samplePetsForTrade);
	const [_nftGenerator, setNftGenerator] = useState(null);
	const [_nftMarketplace, setNftMarketplace] = useState(null);
	const [_tokenContract, setTokenContract] = useState(null);
	const { walletProvider } = useAppKitProvider();
	const { address, isConnected } = useAppKitAccount();

	useEffect(() => {
		if (isConnected) {
			getTokenBalance();
		}
	}, [isConnected]);

	const getTokenContract = async () => {
		if (!isConnected) {
			toast.error("Wallet not connected");
			return null;
		}
		if (_tokenContract) {
			return _tokenContract;
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
			toast.error("Failed to fetch contract: " + error.message);
			return null;
		}
	};

	const getTokenBalance = async () => {
		const tokenContract = await getTokenContract();
		if (!tokenContract) {
			return;
		}
		const balance = await tokenContract.balanceOf(address);
		const formattedBalance = ethers.formatEther(balance);
		setBalance(formattedBalance);
	};

	const buyTokens = async () => {
		const tokenContract = await getTokenContract();
		await toast.promise(
			(async () => {
				const amount = ethers.parseEther((tokensToBuy * 0.0001).toString());
				const tx = await tokenContract.buyTokens({
					value: amount,
				});
				const receipt = await tx.wait();
				console.log(receipt);
				return receipt;
			})(),
			{
				loading: "Buying tokens...",
				success: "Tokens bought successfully",
				error: "Failed to buy tokens",
			}
		);
		setShowBuyTokens(false);
		setTokensToBuy(0);
		await getTokenBalance();
	};

	const feedPet = (foodItem) => {
		const updatedFoodBag = foodBag
			.map((item) =>
				item.name === foodItem.name
					? { ...item, quantity: item.quantity - 1 }
					: item
			)
			.filter((item) => item.quantity > 0);

		const updatedPets = pets.map((pet, index) =>
			index === currentPetIndex
				? {
						...pet,
						strength: pet.strength + foodItem.strength,
						intelligence: pet.intelligence + foodItem.intelligence,
				  }
				: pet
		);

		setFoodBag(updatedFoodBag);
		setPets(updatedPets);
		setShowFeedPopup(false);
	};

	const buyFood = (item) => {
		if (balance >= item.price) {
			setBalance(balance - item.price);
			const existingItem = foodBag.find((food) => food.name === item.name);
			if (existingItem) {
				setFoodBag(
					foodBag.map((food) =>
						food.name === item.name
							? { ...food, quantity: (food.quantity || 0) + 1 }
							: food
					)
				);
			} else {
				setFoodBag([...foodBag, { ...item, quantity: 1 }]);
			}
		}
	};

	const sellPet = (petId, price) => {
		const petToSell = pets.find((pet) => pet.id === petId);
		if (petToSell) {
			setPets(pets.filter((pet) => pet.id !== petId));
			setPetsForSale([...petsForSale, { ...petToSell, price }]);
		}
	};

	const handlePetChange = (index) => {
		setCurrentPetIndex(index);
		setSelectedPet(pets[index]);
	};

	const buyPet = (petId) => {
		const petToBuy = petsForSale.find((pet) => pet.id === petId);
		if (petToBuy && balance >= petToBuy.price) {
			setBalance(balance - petToBuy.price);
			setPets([...pets, petToBuy]);
			setPetsForSale(petsForSale.filter((pet) => pet.id !== petId));
		}
	};
	return (
		<div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800">
			<Sidenav
				activeSection={activeSection}
				setActiveSection={setActiveSection}
				setShowBuyTokens={setShowBuyTokens}
			/>

			<div className="flex-1 flex flex-col">
				<Navbar balance={balance} />

				<main className="flex-1 p-8 overflow-auto">
					<AnimatePresence mode="wait">
						{activeSection === "pets" && (
							<motion.div
								key="pets"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<PetCard
									pets={pets}
									currentPetIndex={currentPetIndex}
									setCurrentPetIndex={handlePetChange}
									setShowFeedPopup={setShowFeedPopup}
									onSellPet={sellPet}
								/>
							</motion.div>
						)}

						{activeSection === "food" && (
							<motion.div
								key="food"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<FoodManagement
									balance={balance}
									setBalance={setBalance}
									foodBag={foodBag}
									setFoodBag={setFoodBag}
								/>
							</motion.div>
						)}

						{activeSection === "games" && (
							<motion.div
								key="games"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<MiniGames
									setSelectedGame={setSelectedGame}
									selectedPet={selectedPet}
								/>
							</motion.div>
						)}
						{activeSection === "market" && (
							<motion.div
								key="market"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<PetMarket
									balance={balance}
									setBalance={setBalance}
									pets={pets}
									setPets={setPets}
									petsForSale={petsForSale}
									onBuyPet={buyPet}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</main>
			</div>

			<AnimatePresence>
				{selectedGame && (
					<GamePopup
						game={selectedGame}
						onClose={() => setSelectedGame(null)}
					/>
				)}

				{showBuyTokens && (
					<BuyTokensPopup
						tokensToBuy={tokensToBuy}
						setTokensToBuy={setTokensToBuy}
						onBuy={buyTokens}
						onClose={() => setShowBuyTokens(false)}
					/>
				)}

				{showFeedPopup && (
					<FeedPopup
						pet={pets[currentPetIndex]}
						foodBag={foodBag}
						onFeed={feedPet}
						onClose={() => setShowFeedPopup(false)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}


function Sidenav({ activeSection, setActiveSection, setShowBuyTokens }) {
	const navItems = [
		{ id: "pets", icon: PawPrint, label: "Pets" },
		{ id: "food", icon: ShoppingBag, label: "Food" },
		{ id: "games", icon: Gamepad2, label: "Games" },
		{ id: "market", icon: ShoppingCart, label: "Market" },
	];

	return (
		<motion.div
			className="w-20 bg-gradient-to-b from-indigo-800 to-purple-800 text-white shadow-lg flex flex-col items-center py-8 space-y-8"
			initial={{ x: -100 }}
			animate={{ x: 0 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			{navItems.map((item) => (
				<motion.button
					key={item.id}
					className={`p-2 rounded-lg ${
						activeSection === item.id
							? "bg-indigo-600 text-yellow-400"
							: "text-gray-300 hover:bg-indigo-700"
					}`}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setActiveSection(item.id)}
				>
					<item.icon className="w-8 h-8" />
					<span className="text-xs mt-1">{item.label}</span>
				</motion.button>
			))}
			<motion.button
				className="p-2 rounded-lg text-gray-300 hover:bg-indigo-700"
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => setShowBuyTokens(true)}
			>
				<Coins className="w-8 h-8" />
				<span className="text-xs mt-1">Tokens</span>
			</motion.button>
		</motion.div>
	);
}

function PetCard({
	pets,
	currentPetIndex,
	setCurrentPetIndex,
	setShowFeedPopup,
	onSellPet,
}) {
	const pet = pets[currentPetIndex];
	const [showSellPopup, setShowSellPopup] = useState(false);

	return (
		<motion.div
			className="bg-white rounded-lg shadow-lg p-6 overflow-hidden"
			whileHover={{ scale: 1.02 }}
			transition={{ type: "spring", stiffness: 300 }}
		>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold text-indigo-600">Your Pets</h2>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() =>
							setCurrentPetIndex(
								(currentPetIndex - 1 + pets.length) % pets.length
							)
						}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<span>
						{currentPetIndex + 1} / {pets.length}
					</span>
					<Button
						variant="outline"
						size="icon"
						onClick={() =>
							setCurrentPetIndex((currentPetIndex + 1) % pets.length)
						}
					>
						<ChevronRight className="h-4 h-4" />
					</Button>
				</div>
			</div>
			<div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
				<div className="relative w-full md:w-1/2 h-64 md:h-auto">
					<AnimatePresence mode="wait">
						<motion.div
							key={pet.id}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							className="absolute inset-0 flex items-center justify-center"
						>
							<div className="text-[200px]">{pet.icon}</div>
						</motion.div>
					</AnimatePresence>
				</div>
				<div className="flex-1 space-y-4">
					<div>
						<h3 className="text-2xl font-semibold">{pet.name}</h3>
						<p className="text-gray-600 text-lg">
							Level {pet.level} {pet.type}
						</p>
					</div>
					<div className="space-y-2">
						<AttributeBar label="Strength" value={pet.strength} />
						<AttributeBar label="Intelligence" value={pet.intelligence} />
					</div>
					<div className="flex space-x-2">
						<Button
							className="flex-1 bg-green-500 hover:bg-green-600 text-white"
							onClick={() => setShowFeedPopup(true)}
						>
							Feed Pet
						</Button>
						<Button
							className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white"
							onClick={() => setShowSellPopup(true)}
						>
							Sell Pet
						</Button>
					</div>
				</div>
			</div>
			{showSellPopup && (
				<SellPetPopup
					pet={pet}
					onSell={onSellPet}
					onClose={() => setShowSellPopup(false)}
				/>
			)}
		</motion.div>
	);
}

function AttributeBar({ label, value }) {
	return (
		<div className="flex justify-between items-center">
			<span className="font-medium">{label}</span>
			<div className="w-48 bg-gray-200 rounded-full h-2.5 overflow-hidden">
				<motion.div
					className="h-2.5 rounded-full bg-indigo-600"
					initial={{ width: 0 }}
					animate={{ width: `${(value / 20) * 100}%` }}
					transition={{ duration: 0.5, ease: "easeInOut" }}
				/>
			</div>
			<span className="ml-2 font-medium">{value}</span>
		</div>
	);
}

function FoodManagement({ balance, setBalance, foodBag, setFoodBag }) {
	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<h2 className="text-2xl font-bold mb-4 text-indigo-600">
				Food Management
			</h2>
			<div className="space-y-6">
				<FoodBag foodBag={foodBag} />
				<FoodShop
					balance={balance}
					setBalance={setBalance}
					foodBag={foodBag}
					setFoodBag={setFoodBag}
				/>
			</div>
		</div>
	);
}

function FoodBag({ foodBag }) {
	return (
		<div className="bg-indigo-50 rounded-lg p-4">
			<h3 className="text-xl font-semibold mb-3 text-indigo-600">Food Bag</h3>
			{foodBag.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{foodBag.map((food, index) => (
						<motion.div
							key={index}
							className="bg-white p-4 rounded-lg shadow-md border border-indigo-100"
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						>
							<h4 className="font-semibold text-lg text-indigo-600">
								{food.name}
							</h4>
							<p className="text-gray-600">Quantity: {food.quantity}</p>
							<div className="mt-2 space-y-1">
								<p className="text-gray-600">
									Strength:{" "}
									<span className="font-medium text-green-600">
										+{food.strength}
									</span>
								</p>
								<p className="text-gray-600">
									Intelligence:{" "}
									<span className="font-medium text-blue-600">
										+{food.intelligence}
									</span>
								</p>
							</div>
						</motion.div>
					))}
				</div>
			) : (
				<p className="text-center text-gray-600">
					Your food bag is empty. Visit the shop to buy some food!
				</p>
			)}
		</div>
	);
}

function FoodShop({ balance, setBalance, foodBag, setFoodBag }) {
	const buyFood = (item) => {
		if (balance >= item.price) {
			setBalance(balance - item.price);
			const existingItem = foodBag.find((food) => food.name === item.name);
			if (existingItem) {
				setFoodBag(
					foodBag.map((food) =>
						food.name === item.name
							? { ...food, quantity: (food.quantity || 0) + 1 }
							: food
					)
				);
			} else {
				setFoodBag([...foodBag, { ...item, quantity: 1 }]);
			}
		}
	};
	return (
		<div className="bg-indigo-50 rounded-lg p-4">
			<h3 className="text-xl font-semibold mb-3 text-indigo-600">Food Shop</h3>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{foodItems.map((item, index) => (
					<FoodItem
						key={index}
						item={item}
						balance={balance}
						onBuy={() => buyFood(item)}
					/>
				))}
			</div>
		</div>
	);
}

function FoodItem({ item, balance, onBuy }) {
	const [hover, setHover] = useState(false);

	return (
		<motion.div
			className="bg-white p-6 rounded-lg shadow-md border border-indigo-100"
			whileHover={{ scale: 1.05 }}
			onHoverStart={() => setHover(true)}
			onHoverEnd={() => setHover(false)}
		>
			<h4 className="font-semibold text-xl mb-2 text-indigo-600">
				{item.name}
			</h4>
			<div className="space-y-2 mb-4">
				<p className="text-gray-700 font-medium">
					Price: <span className="text-green-600">{item.price} Tokens</span>
				</p>
				<motion.div
					animate={{ opacity: hover ? 1 : 0.7 }}
					className="space-y-1"
				>
					<p className="text-gray-600">
						Strength:{" "}
						<span className="font-medium text-indigo-600">
							+{item.strength}
						</span>
					</p>
					<p className="text-gray-600">
						Intelligence:{" "}
						<span className="font-medium text-indigo-600">
							+{item.intelligence}
						</span>
					</p>
				</motion.div>
			</div>
			<Button
				className="w-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-200"
				onClick={onBuy}
				disabled={balance < item.price}
			>
				{balance < item.price ? "Not enough tokens" : "Buy"}
			</Button>
		</motion.div>
	);
}

function MiniGames({ setSelectedGame, selectedPet }) {
	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<h2 className="text-2xl font-bold mb-4 text-indigo-600">Mini-Games</h2>
			<div className="space-y-4">
				{games.map((game, index) => (
					<GameItem
						key={index}
						game={game}
						setSelectedGame={setSelectedGame}
						selectedPet={selectedPet}
					/>
				))}
			</div>
		</div>
	);
}

function GameItem({ game, setSelectedGame, selectedPet }) {
	const router = useRouter();

	const startGame = () => {
		const queryString = new URLSearchParams({
			pet: JSON.stringify(selectedPet.id),
		}).toString();
		router.push(`${game.url}?${queryString}`);
	};
	return (
		<motion.div
			className="bg-indigo-50 p-4 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			onClick={startGame}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					{game.icon}
					<h3 className="font-semibold">{game.name}</h3>
				</div>
				<ChevronDown className="w-5 h-5 text-indigo-600" />
			</div>
		</motion.div>
	);
}

function GamePopup({ game, onClose }) {
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
				<p className="text-gray-600 mb-4">{game.description}</p>
				<h4 className="font-semibold mb-2">Strategy:</h4>
				<p className="text-gray-600 mb-4">{game.strategy}</p>
				<h4 className="font-semibold mb-2">Benefits:</h4>
				<p className="text-gray-600 mb-4">{game.benefits}</p>
				<Button
					className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
					onClick={() => playGame(game.url)}
				>
					Play Now
				</Button>
			</motion.div>
		</motion.div>
	);
}

function BuyTokensPopup({ tokensToBuy, setTokensToBuy, onBuy, onClose }) {
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
						onClick={() => setTokensToBuy(Math.max(0, tokensToBuy - 10))}
					>
						<Minus className="w-4 h-4" />
					</Button>
					<span className="text-2xl font-bold">{tokensToBuy}</span>
					<Button
						variant="outline"
						size="icon"
						onClick={() => setTokensToBuy(tokensToBuy + 10)}
					>
						<Plus className="w-4 h-4" />
					</Button>
				</div>
				<p className="text-center mb-4">Total: {tokensToBuy * 0.0001} Eth</p>
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

function FeedPopup({ pet, foodBag, onFeed, onClose }) {
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
					Feed {pet.name}
				</h3>
				{foodBag.length > 0 ? (
					<div className="space-y-4">
						{foodBag.map((food, index) => (
							<Button
								key={index}
								className="w-full bg-green-500 hover:bg-green-600 text-white"
								onClick={() => onFeed(food)}
							>
								{food.name} (x{food.quantity})
							</Button>
						))}
					</div>
				) : (
					<p className="text-center text-gray-600">
						No food available. Visit the shop to buy some!
					</p>
				)}
			</motion.div>
		</motion.div>
	);
}

function PetMarket({
	balance,
	setBalance,
	pets,
	setPets,
	petsForSale,
	onBuyPet,
}) {
	const [showBuyPetPopup, setShowBuyPetPopup] = useState(false);

	const buyNewPet = () => {
		if (balance >= 100) {
			setBalance(balance - 100);
			const newPet = {
				id: pets.length + 1,
				name: `Pet ${pets.length + 1}`,
				type: "Mystery",
				level: 1,
				strength: 5,
				intelligence: 5,
				icon: "🐾",
			};
			setPets([...pets, newPet]);
			setShowBuyPetPopup(false);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-6 mt-8">
			<h2 className="text-2xl font-bold mb-4 text-indigo-600">Pet Market</h2>
			<div className="space-y-4">
				<Button
					className="w-full bg-green-500 hover:bg-green-600 text-white"
					onClick={() => setShowBuyPetPopup(true)}
				>
					Buy New Pet (100 Tokens)
				</Button>
				<h3 className="text-xl font-semibold mt-6 mb-3 text-indigo-600">
					Pets for Sale
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{petsForSale.map((pet) => (
						<PetForSaleCard
							key={pet.id}
							pet={pet}
							onBuy={() => onBuyPet(pet.id)}
							balance={balance}
						/>
					))}
				</div>
			</div>
			{showBuyPetPopup && (
				<BuyPetPopup
					onBuy={buyNewPet}
					onClose={() => setShowBuyPetPopup(false)}
					balance={balance}
				/>
			)}
		</div>
	);
}

function PetForSaleCard({ pet, onBuy, balance }) {
	return (
		<motion.div
			className="bg-white p-4 rounded-lg shadow-md border border-indigo-100"
			whileHover={{ scale: 1.05 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			<div className="flex items-center justify-between mb-2">
				<h4 className="font-semibold text-lg text-indigo-600">{pet.name}</h4>
				<span className="text-2xl">{pet.icon}</span>
			</div>
			<p className="text-gray-600">Type: {pet.type}</p>
			<p className="text-gray-600">Level: {pet.level}</p>
			<div className="mt-2 space-y-1">
				<p className="text-gray-600">
					Strength:{" "}
					<span className="font-medium text-green-600">{pet.strength}</span>
				</p>
				<p className="text-gray-600">
					Intelligence:{" "}
					<span className="font-medium text-blue-600">{pet.intelligence}</span>
				</p>
			</div>
			<p className="text-lg font-semibold mt-2 mb-3">
				Price: {pet.price} Tokens
			</p>
			<Button
				className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
				onClick={onBuy}
				disabled={balance < pet.price}
			>
				{balance < pet.price ? "Not enough tokens" : "Buy Pet"}
			</Button>
		</motion.div>
	);
}

function BuyPetPopup({ onBuy, onClose, balance }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
		>
			<motion.div
				initial={{ scale: 9, opacity: 0 }}
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

function SellPetPopup({ pet, onSell, onClose }) {
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
