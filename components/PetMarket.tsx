import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { Pet } from "@/types";
import { BuyPetPopup } from "./BuyPetPopup";
import { PetForSaleCard } from "./PetForSaleCard";
import { samplePetsForTrade } from "@/constants/gameData";
import { ethers } from "ethers";
import NftGeneratorABI from "@/contract_abis/nft_generator_abi.json";
import NftMarketplaceABI from "@/contract_abis/nft_marketplace_abi.json";
import NftMarketplaceAddress from "@/contract_address/nft_marketplace_address.json";
import { useAppKitAccount } from "@reown/appkit/react";
import NftGeneratortAddress from "@/contract_address/nft_generator_address.json";
import { infura } from "@/contract_address/infura.json";
export function PetMarket({
	balance,
	setBalance,
	pets,
	setPets,
	onBuyPet,
	onBuyDefaultPet,
}) {
	const [showBuyPetPopup, setShowBuyPetPopup] = useState(false);

	const [petsForSale, setPetsForSale] = useState<Pet[]>([]); // Initialize as empty array
	const { address } = useAppKitAccount();
	useEffect(() => {
		const initializeEthers = async () => {
			if (window.ethereum) {
				const ethersProvider = new ethers.BrowserProvider(window.ethereum);
				const signer = await ethersProvider.getSigner();
				const contract = new ethers.Contract(
					NftMarketplaceAddress.address,
					NftMarketplaceABI,
					signer
				);
				const chainId = await ethersProvider
					.getNetwork()
					.then((network) => network.chainId);

				const nft_contract = new ethers.Contract(
					NftGeneratortAddress.address,
					NftGeneratorABI,
					signer
				);
				getAllListedNFTs(contract, nft_contract, chainId);
			} else {
				console.error("Ethereum provider (e.g., MetaMask) not found.");
			}
		};

		initializeEthers();
	}, []);

	const getAllListedNFTs = useCallback(
		async (contract, nft_contract, chainId) => {
			try {
				const listedNFTs = await contract.getAllListedNFTs();
				const nftss = []; // Array to store NFT details

				for (let i = 0; i < listedNFTs.length; i++) {
					const listedNFT = listedNFTs[i];
					const tokenId = listedNFT.tokenId;

					try {
						const nftDetails = await nft_contract.getNFTDetails(tokenId);
						const pet = {
							id: tokenId, // Assuming tokenId is part of nftDetails
							name: nftDetails.name, // Assuming name is part of nftDetails
							type: nftDetails.xP, // Assuming type is part of nftDetails
							level: nftDetails.level, // Assuming level is part of nftDetails
							strength: nftDetails.strength, // Assuming strength is part of nftDetails
							intelligence: nftDetails.intelligence, // Assuming intelligence is part of nftDetails
							image: nftDetails.imageLink, // Assuming image is part of nftDetails
							chainId: chainId, // Assuming chainId is part of nftDetails
							price: listedNFT.price, // Use the price from listedNFT
							listingId: listedNFT.listingId,
						};

						nftss.push(pet);
					} catch (error) {
						console.error(
							`Error fetching details for tokenId ${tokenId}:`,
							error
						);
					}
				}
				console.log(nftss);
				setPetsForSale(nftss);
				console.log("Listed NFTs:", listedNFTs);
			} catch (error) {
				console.error("Error fetching listed NFTs:", error);
			}
		},
		[]
	);

	const buyNewPet = async (name) => {
		if (balance >= 100) {
			setShowBuyPetPopup(false);
			console.log(name)
			try {
				await onBuyDefaultPet(name);
			} catch (error) {
				console.error("Error buying default pet:", error);
			}
		}
	};

	const handleBuyPet = async (pet: Pet) => {
		const ethersProvider = new ethers.BrowserProvider(window.ethereum);
		const signer = await ethersProvider.getSigner();
		const nftGeneratorContraact = new ethers.Contract(
			NftGeneratortAddress.address,
			NftGeneratorABI,
			signer
		);

		const contract = new ethers.Contract(
			NftMarketplaceAddress.address,
			NftMarketplaceABI,
			signer
		);
		if (nftGeneratorContraact == null) return;
		const nftDetails = await nftGeneratorContraact.getNFTDetails(pet.id);
		console.log("NFT Details:", nftDetails);

		// Mint a new NFT with the same attributes
		const tx111 = await nftGeneratorContraact.mintNFT(
			nftDetails.name,
			nftDetails.level,
			nftDetails.strength,
			nftDetails.intelligence,
			nftDetails.imageLink
		);

		// const t11 = await nftGeneratorContraact.removeUserNFT(pet.id)

		const t112 = await contract.removeUserNFT(pet.listingId);
		// await t11.wait();
		await t112.wait();

		const receipt = await tx111.wait();
		console.log("NFT Minted Successfully:", receipt);
		// const petToBuy = petsForSale.find((pet) => pet.id === petId);
		// if (petToBuy && balance >= petToBuy.price) {
		//   setBalance(balance - petToBuy.price);
		//   setPets([...pets, petToBuy]);
		//   setPetsForSale(petsForSale.filter((pet) => pet.id !== petId));
		//   try {
		//     await onBuyPet();
		//   } catch (error) {
		//     console.error("Error buying pet:", error);
		//   }
		// }

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
				{petsForSale.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{petsForSale.map((pet) => (
							<PetForSaleCard
								key={pet.id}
								pet={pet}

								onBuy={() => handleBuyPet(pet)}

								balance={balance}
							/>
						))}
					</div>
				) : (
					<p className="text-center text-gray-600">
						No pets available for sale at the moment. Please check back later!
					</p>
				)}
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
