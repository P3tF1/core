import { useState, useEffect } from "react";
import { FoodBag } from "./FoodBag";
import { FoodShop } from "./FoodShop";
import type { FoodItem, FoodBagItem } from "@/types";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";
import { showToast } from "@/utils/toast";
import NftGeneratorABI from "@/contract_abis/nft_generator_abi.json";
import NftGeneratortAddress from "@/contract_address/nft_generator_address.json";
import TokenABI from "@/contract_abis/p3tf1_coin_abi.json";
import TokenAddress from "@/contract_address/p3tf1_coin_address.json";

import {infura} from "@/contract_address/infura.json";

interface FoodManagementProps {
	balance: number;
	setBalance: (balance: number) => void;
}

export function FoodManagement({ balance, setBalance }: FoodManagementProps) {
	const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
	const [foodBag, setFoodBag] = useState<FoodBagItem[]>([]);
	const { address, isConnected } = useAppKitAccount();
	const [nftGenerator, setNftGenerator] = useState<ethers.Contract | null>(
		null
	);
	const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(
		null
	);

	useEffect(() => {
		if (isConnected) {
			fetchAllPetFoods();
			getTokenBalance();
			fetchUserPetFoods();
		}
	}, [isConnected]);

	const getNftGenContract = async () => {
		if (!isConnected) {
			showToast.error("Wallet not connected");
			return null;
		}
		if (nftGenerator) {
			return nftGenerator;
		}
		try {

			const ethersProvider = new ethers.BrowserProvider(window.ethereum)
			const signer = await ethersProvider.getSigner()

	
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

	const getTokenBalance = async () => {
		const contract = await getTokenContract();
		if (!contract) return;
		const balance = await contract.balanceOf(address);
		const formattedBalance = ethers.formatEther(balance);
		setBalance(Number(formattedBalance));
	};

	const fetchAllPetFoods = async () => {
		try {
			const contract = await getNftGenContract();
			if (!contract) return;
			const petFoodCounter = await contract.petFoodCounter();
			const petFoods = [];
			for (let i = 1; i <= petFoodCounter; i++) {
				const petFood = await contract.petFoods(i);
				petFoods.push({
					id: petFood.id.toString(),
					name: petFood.name,
					strength: petFood.strengthBoost.toString(),
					intelligence: petFood.intelligenceBoost.toString(),
					price: petFood.price.toString(),
				});
			}
			setFoodItems(petFoods);
		} catch (error) {
			showToast.error("Error fetching PetFood items: " + error.message);
		}
	};

	const fetchUserPetFoods = async () => {
		try {
			const contract = await getNftGenContract();
			if (!contract) return;
			const [petFoods, amounts] = await contract.getUserPetFoodDetails(address);
			const userPetFoodDetails = petFoods.map((petFood, index) => ({
				id: petFood.id.toString(),
				name: petFood.name,
				strength: petFood.strengthBoost.toString(),
				intelligence: petFood.intelligenceBoost.toString(),
				price: petFood.price.toString(),
				quantity: amounts[index].toString(),
			}));
			setFoodBag(userPetFoodDetails);
		} catch (error) {
			showToast.error("Error fetching user's PetFood items: " + error.message);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<h2 className="text-2xl font-bold mb-4 text-indigo-600">
				Food Management
			</h2>
			<div className="space-y-6">
				<FoodBag foodBag={foodBag} />
				<FoodShop
					foodItems={foodItems}
					balance={balance}
					setBalance={setBalance}
					onBuyFood={fetchUserPetFoods}
					getTokenBalance={getTokenBalance}
				/>
			</div>
		</div>
	);
}
