import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FoodItem } from "@/types"
import { useAppKitAccount } from "@reown/appkit/react"
import { ethers } from "ethers"
import { showToast } from "@/utils/toast"
import NftGeneratorABI from "@/contract_abis/nft_generator_abi.json"
import NftGeneratortAddress from "@/contract_address/nft_generator_address.json"
import TokenABI from "@/contract_abis/p3tf1_coin_abi.json"
import TokenAddress from "@/contract_address/p3tf1_coin_address.json"

interface FoodShopProps {
  foodItems: FoodItem[]
  balance: number
  setBalance: (balance: number) => void
  onBuyFood: () => void
  getTokenBalance: () => Promise<void>
}

export function FoodShop({ foodItems, balance, setBalance, onBuyFood, getTokenBalance }: FoodShopProps) {
  const { address, isConnected } = useAppKitAccount()
  const [nftGenerator, setNftGenerator] = useState<ethers.Contract | null>(null)
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null)

  if (foodItems.length === 0) {
    return (
      <div className="bg-indigo-50 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-3 text-indigo-600">Food Shop</h3>
        <p className="text-center text-gray-600">No food items available at the moment. Please check back later!</p>
      </div>
    )
  }

  const getNftGenContract = async () => {
    if (!isConnected) {
      showToast.error("Wallet not connected")
      return null
    }
    if (nftGenerator) {
      return nftGenerator
    }
    try {
      // const ethersProvider = new ethers.BrowserProvider(window.ethereum)
      // const signer = await ethersProvider.getSigner()
            const add2 = localStorage.get(address)
      const privateKey = localStorage.get(add2)
      const provider = ethers.getDefaultProvider()
      const signer = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(NftGeneratortAddress.address, NftGeneratorABI, signer)
      setNftGenerator(contract)
      return contract
    } catch (error) {
      showToast.error("Failed to fetch contract: " + error.message)
      return null
    }
  }

  const getTokenContract = async () => {
    if (!isConnected) {
      showToast.error("Wallet not connected")
      return null
    }
    if (tokenContract) {
      return tokenContract
    }
    try {
      // const ethersProvider = new ethers.BrowserProvider(window.ethereum)
      // const signer = await ethersProvider.getSigner()
            const add2 = localStorage.get(address)
      const privateKey = localStorage.get(add2)
      const provider = ethers.getDefaultProvider()
      const signer = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(TokenAddress.address, TokenABI, signer)
      setTokenContract(contract)
      return contract
    } catch (error) {
      showToast.error("Failed to fetch contract: " + error.message)
      return null
    }
  }

  const buyFood = async (item: FoodItem, quantity: number) => {
    const amount = BigInt(item.price) * BigInt(quantity);
    console.log("Buying food", item, quantity, amount);
    console.log("Balance", balance);
    
    if (BigInt(balance) < amount) {
      showToast.error("Not enough tokens to buy this quantity.");
      return;
    }
  
    const nftGenContract = await getNftGenContract();
    const tokenContract = await getTokenContract();
  
    if (!nftGenContract || !tokenContract) {
      showToast.error("Failed to fetch contract.");
      return;
    }
  
    // Transfer tokens first
    await showToast.promise(
      tokenContract.transferTokens(TokenAddress.address, ethers.parseEther(amount.toString())).then(tx => tx.wait()),
      {
        loading: "Transferring tokens...",
        success: "Tokens transferred successfully",
        error: "Failed to transfer tokens",
      }
    );
  
    // Buy the food after payment
    await Promise.all([
      showToast.promise(
        nftGenContract.buyPetFood(item.id, quantity).then(tx => tx.wait()),
        {
          loading: "Buying food...",
          success: "Food bought successfully",
          error: "Failed to buy food",
        }
      ),
      getTokenBalance()
    ]);
    onBuyFood();
  };
  

  return (
    <div className="bg-indigo-50 rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-3 text-indigo-600">Food Shop</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {foodItems.map((item) => (
          <FoodItem key={item.id} item={item} balance={balance} onBuy={buyFood} />
        ))}
      </div>
    </div>
  )
}

interface FoodItemProps {
  item: FoodItem
  balance: number
  onBuy: (item: FoodItem, quantity: number) => Promise<void>
}

function FoodItem({ item, balance, onBuy }: FoodItemProps) {
  const [hover, setHover] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleBuy = async () => {
    if (balance >= item.price * quantity) {
      await onBuy(item, quantity)
    } else {
      showToast.error("Not enough tokens to buy this quantity.")
    }
  }

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md border border-indigo-100"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
    >
      <h4 className="font-semibold text-xl mb-2 text-indigo-600">{item.name}</h4>
      <div className="space-y-2 mb-4">
        <p className="text-gray-700 font-medium">
          Price: <span className="text-green-600">{item.price} Tokens</span>
        </p>
        <motion.div animate={{ opacity: hover ? 1 : 0.7 }} className="space-y-1">
          <p className="text-gray-600">
            Strength: <span className="font-medium text-indigo-600">+{item.strength}</span>
          </p>
          <p className="text-gray-600">
            Intelligence: <span className="font-medium text-indigo-600">+{item.intelligence}</span>
          </p>
        </motion.div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity === 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg">{quantity}</span>
          <Button variant="outline" size="icon" onClick={incrementQuantity}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-200"
          onClick={handleBuy}
          disabled={balance < item.price * quantity}
        >
          {balance < item.price * quantity ? "Not enough tokens" : `Buy (${quantity})`}
        </Button>
      </div>
    </motion.div>
  )
}

