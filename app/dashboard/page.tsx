"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";
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
import NftGeneratorABI from "@/contract_abis/nft_generator_abi.json";
import NftMarketplaceABI from "@/contract_abis/nft_marketplace_abi.json";
import NftMarketplaceAddress from "@/contract_address/nft_marketplace_address.json";
import NftGeneratortAddress from "@/contract_address/nft_generator_address.json";
import TokenAddress from "@/contract_address/p3tf1_coin_address.json";
import { testImageLink } from "@/constants/gameData";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showBuyTokens, setShowBuyTokens] = useState(false);
  const [tokensToBuy, setTokensToBuy] = useState(0);
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
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
  const [ foodBag, setFoodBag ] = useState([]);

  useEffect(() => {
    if (isConnected) {
      getTokenBalance();
      findPet();
      fetchUserPetFoods();
    }
  }, [isConnected]);

  const fetchUserPetFoods = async () => {
    try {
      const contract = await getNftGenContract()
      if (!contract) return
      const [petFoods, amounts] = await contract.getUserPetFoodDetails(address)
      const userPetFoodDetails = petFoods.map((petFood, index) => ({
        id: petFood.id.toString(),
        name: petFood.name,
        strength: petFood.strengthBoost.toString(),
        intelligence: petFood.intelligenceBoost.toString(),
        price: petFood.price.toString(),
        quantity: amounts[index].toString(),
      }))
      setFoodBag(userPetFoodDetails)
    } catch (error) {
      showToast.error("Error fetching user's PetFood items: " + error.message)
    }
  }

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

  const feedPet = async (foodItem, pet) => {
    const contract = await getNftGenContract();
    if (contract == null) return;
    await showToast.promise(contract.feedPet(pet.id, foodItem.id), {
      loading: "Feeding pet...",
      success: "Pet fed successfully",
      error: "Failed to feed pet",
    });
    findPet();
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

  const buyDefaultPet = async () => {
    try {
      const nftGenContract = await getNftGenContract();
      const tokenContract = await getTokenContract();

      if (!nftGenContract || !tokenContract) {
        showToast.error("Failed to fetch contract");
        return;
      }
  
      // Transfer tokens first (assuming it's required for minting)
      await showToast.promise(
        tokenContract.transferTokens(TokenAddress.address, ethers.parseEther("100")),
        {
          loading: "Transferring tokens...",
          success: "Tokens transferred successfully",
          error: "Failed to transfer tokens",
        }
      );
  
      await Promise.all([showToast.promise(
        nftGenContract.mintNFT("Default Pet", 1, 1, 1, testImageLink),
        {
          loading: "Buying pet...",
          success: "Pet bought successfully",
          error: "Failed to buy pet",
        }
      ), getTokenBalance()]);
      await findPet();

    } catch (error) {
      console.error("Error in buyDefaultPet:", error);
      showToast.error("An unexpected error occurred");
    }
  };
  

  const sellPet = async (petId: number, price: number) => {
    const contract = await getNftmarketContract();
    if (contract == null) return;
    await showToast.promise(
      contract.listPetForSale(petId, ethers.parseEther(price.toString())),
      {
        loading: "Listing pet for sale...",
        success: "Pet listed for sale successfully",
        error: "Failed to list pet for sale",
      }
    );
    findPet();
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
                  setCurrentPetIndex={setCurrentPetIndex}
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
                <MiniGames setSelectedGame={setSelectedGame} />
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
