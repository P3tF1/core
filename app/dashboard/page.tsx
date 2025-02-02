"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { ethers, getAddress } from "ethers";
import { showToast } from "@/utils/toast";
import { Navbar } from "@/components/Navbar";
import { Sidenav } from "@/components/Sidenav";
import { PetCard } from "@/components/PetCard";
import { FoodManagement } from "@/components/FoodManagement";
import { MiniGames } from "@/components/MiniGames";
import { PetMarket } from "@/components/PetMarket";
import { GamePopup } from "@/components/GamePopup";
import { BuyTokensPopup } from "@/components/BuyTokensPopup";
import { FeedPopup } from "@/components/FeedPopup";
import type { Pet, Game } from "@/types";
import TokenABI from "@/contract_abis/p3tf1_coin_abi.json";
import TokenAddress from "@/contract_address/p3tf1_coin_address.json";
import NftGeneratorABI from "@/contract_abis/nft_generator_abi.json";
import NftGeneratortAddress from "@/contract_address/nft_generator_address.json";
import NftMarketplaceABI from "@/contract_abis/nft_marketplace_abi.json";
import NftMarketplaceAddress from "@/contract_address/nft_marketplace_address.json";
import { testImageLink } from "@/constants/gameData";
import { infura } from "@/contract_address/infura.json";
// require('dotenv').config();

// const infuraProjectId = process.env.INFURA_PROJECT_ID;
export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showBuyTokens, setShowBuyTokens] = useState(false);
  const [tokensToBuy, setTokensToBuy] = useState(0);
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [selectedPet, setSelectedPet] = useState(pets[0]);

  const [showFeedPopup, setShowFeedPopup] = useState(false);
  const [activeSection, setActiveSection] = useState("pets");
  const [nftGenerator, setNftGenerator] = useState<ethers.Contract | null>(
    null
  );
  const [nftMarketplace, setNftMarketplace] = useState<ethers.Contract | null>(
    null
  );
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(
    null
  );
  const { walletProvider } = useAppKitProvider();
  const { address, isConnected } = useAppKitAccount();
  const [foodBag, setFoodBag] = useState([]);

  useEffect(() => {
    if (isConnected) {
      getTokenBalance();
      findPet();
      fetchUserPetFoods();

      generateKeyPair();
    }
  }, [isConnected]);

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

  const getNftmarketContract = async () => {
    if (!isConnected) {
      showToast.error("Wallet not connected");
      return null;
    }
    if (nftMarketplace) {
      return nftMarketplace;
    }
    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();

      const contract = new ethers.Contract(
        NftMarketplaceAddress.address,
        NftMarketplaceABI,
        signer
      );
      setNftMarketplace(contract);
      return contract;
    } catch (error) {
      showToast.error("Failed to fetch contract: " + error.message);
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
    setBalance(Number(formattedBalance));
  };

  const buyTokens = async () => {
    const tokenContract = await getTokenContract();
    const ethersProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await ethersProvider.getSigner();

    await showToast.promise(
      (async () => {
        const amount = ethers.parseEther((tokensToBuy * 0.000001).toString());
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

  function generateKeyPair() {
    // Create a new random wallet
    const wallet = ethers.Wallet.createRandom();

    // Extract private key, public key, and address
    const privateKey = wallet.privateKey;
    const publicKey = wallet.publicKey;
    const address1 = wallet.address;

    // Store the private key in localStorage, mapped to the public key
    localStorage.setItem(address1, privateKey);
    if (address) localStorage.setItem(address, address1);
  }

  const feedPet = async (foodItem, pet) => {
    const contract = await getNftGenContract();
    if (contract == null) return;
    setShowFeedPopup(false);

    await showToast.promise(contract.feedPet(pet.id, foodItem.id), {
      loading: "Feeding pet...",
      success: "Pet fed successfully",
      error: "Failed to feed pet",
    });

    setTimeout(async () => {
      await findPet();
    }, 4000);
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
      });
    }
    console.log(finalPetsArray);
    setPets(finalPetsArray);
    return finalPetsArray;
  };

	const buyDefaultPet = async (petName) => {
		try {
			const nftGenContract = await getNftGenContract();
			const tokenContract = await getTokenContract();

      if (!nftGenContract || !tokenContract) {
        showToast.error("Failed to fetch contract");
        return;
      }

      // Transfer tokens first (assuming it's required for minting)
      await showToast.promise(
        tokenContract.transferTokens(
          TokenAddress.address,
          ethers.parseEther("100")
        ),
        {
          loading: "Transferring tokens...",
          success: "Tokens transferred successfully",
          error: "Failed to transfer tokens",
        }
      );

			await Promise.all([
				showToast.promise(
					nftGenContract.mintNFT(petName, 1, 1, 1, testImageLink),
					{
						loading: "Buying pet...",
						success: "Pet bought successfully",
						error: "Failed to buy pet",
					}
				),
				getTokenBalance(),
			]);
			await findPet();
		} catch (error) {
			console.error("Error in buyDefaultPet:", error);
			showToast.error("An unexpected error occurred");
		}
	};


  const sellPet = async (pet: Pet, price: number) => {
    try {
      const contract = await getNftmarketContract();
      const nftGeneratorContract = await getNftGenContract();
      if (!contract || !nftGeneratorContract) {
        showToast.error("Failed to fetch contracts");
        return;
      }
  
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const network = await ethersProvider.getNetwork();
      const chainId = network.chainId;
  
      // Set approval for the marketplace contract to manage the NFT
      const approvalTx = await nftGeneratorContract.setApprovalForAll(
        await contract.getAddress(),
        true
      );
      await approvalTx.wait();
  
      // List NFT for sale
      await showToast.promise(
        contract.listNFT(NftGeneratortAddress.address, pet.id, price).then(tx => tx.wait()),
        {
          loading: "Listing pet for sale...",
          success: "Pet listed successfully",
          error: "Failed to list pet",
        }
      );
  
      // Remove pet from user's inventory
      await showToast.promise(
        nftGeneratorContract.removeUserNFT(pet.id).then(tx => tx.wait()),
        {
          loading: "Updating inventory...",
          success: "Pet removed from inventory",
          error: "Failed to update inventory",
        }
      );
  
      // Refresh UI
      await findPet();
  
    } catch (error) {
      console.error("Error in sellPet:", error);
      showToast.error("An unexpected error occurred");
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
                  setShowFeedPopup={setShowFeedPopup}
                  onSellPet={sellPet}
                  onFeedPet={feedPet}
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
                <FoodManagement balance={balance} setBalance={setBalance} />
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
                  pets={pets}
                  onSelectPet={setSelectedPet}
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
                  onBuyPet={findPet}
                  onBuyDefaultPet={buyDefaultPet}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {selectedGame && selectedPet && (
          <GamePopup
            game={selectedGame}
            pet={selectedPet}
            onClose={() => {
              setSelectedGame(null);
			  setSelectedPet(null);
            }}
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
