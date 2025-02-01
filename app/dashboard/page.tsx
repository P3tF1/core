"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  X,
  Plus,
  Minus,
  PawPrint,
  ShoppingBag,
  Package,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  Coins,
  User,
  Brain,
  Dumbbell,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

const games = [
  {
    name: "Speed Math Challenge",
    description: "Test your math skills in a fast-paced environment!",
    strategy: "Focus on quick mental calculations and pattern recognition.",
    benefits: "Improves your pet's intelligence and reaction time.",
    icon: <Brain className="w-8 h-8" />,
  },
  {
    name: "Card Flip Challenge",
    description: "Match pairs of cards in the shortest time possible!",
    strategy: "Memorize card positions and use logical deduction.",
    benefits: "Enhances your pet's memory and cognitive abilities.",
    icon: <Dumbbell className="w-8 h-8" />,
  },
  {
    name: "Rock Breaker",
    description: "Break as many rocks as you can before time runs out!",
    strategy: "Develop a rhythm and aim for combos to maximize points.",
    benefits: "Boosts your pet's strength and endurance.",
    icon: <ShoppingBag className="w-8 h-8" />,
  },
];

export function MiniGames({ setSelectedGame }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Mini-Games</h2>
      <div className="space-y-4">
        {games.map((game, index) => (
          <GameItem key={index} game={game} setSelectedGame={setSelectedGame} />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [balance, setBalance] = useState(1000);
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
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [foodBag, setFoodBag] = useState([
    { name: "Basic Kibble", quantity: 5, strength: 1, intelligence: 1 },
    { name: "Premium Chow", quantity: 3, strength: 2, intelligence: 2 },
    { name: "Gourmet Feast", quantity: 1, strength: 3, intelligence: 3 },
  ]);
  const [showFeedPopup, setShowFeedPopup] = useState(false);
  const [activeSection, setActiveSection] = useState("pets");

  const buyTokens = () => {
    setBalance(balance + tokensToBuy);
    setShowBuyTokens(false);
    setTokensToBuy(0);
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 text-gray-800">
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
                <MiniGames setSelectedGame={setSelectedGame} />
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
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Play Now</Button>
        </motion.div>
      </motion.div>
    )
  }

function Navbar({ balance }) {
  return (
    <motion.nav
      className="bg-white shadow-md py-4 px-8 sticky top-0 z-10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PawPrint className="w-8 h-8 text-indigo-600" />
          <span className="text-2xl font-bold text-indigo-600">PetFi</span>
        </motion.div>
        <div className="flex items-center space-x-4">
          <motion.div
            className="bg-indigo-100 rounded-full py-2 px-4 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Coins className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="font-semibold">{balance} Tokens</span>
          </motion.div>
          <Button variant="ghost" className="text-indigo-600">
            <appkit-button />
          </Button>
        </div>
      </div>
    </motion.nav>
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
        <p className="text-center mb-4">Total: ${tokensToBuy * 0.1}</p>
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

function FoodBag({ foodBag }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Food Bag</h2>
      {foodBag.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {foodBag.map((food, index) => (
            <motion.div
              key={index}
              className="bg-indigo-50 p-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold text-lg">{food.name}</h3>
              <p className="text-gray-600">Quantity: {food.quantity}</p>
              <p className="text-gray-600">Strength +{food.strength}</p>
              <p className="text-gray-600">Intelligence +{food.intelligence}</p>
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
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Food Shop</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {foodItems.map((item, index) => (
          <FoodItem
            key={index}
            item={item}
            balance={balance}
            setBalance={setBalance}
            foodBag={foodBag}
            setFoodBag={setFoodBag}
          />
        ))}
      </div>
    </div>
  );
}

interface FoodItem {
  name: string;
  price: number;
  strength: number;
  intelligence: number;
  quantity?: number;
}

interface FoodManagementProps {
  balance: number;
  setBalance: (balance: number) => void;
  foodBag: FoodItem[];
  setFoodBag: (foodBag: FoodItem[]) => void;
}

const foodItems: FoodItem[] = [
  { name: "Basic Kibble", price: 5, strength: 1, intelligence: 1 },
  { name: "Premium Chow", price: 10, strength: 2, intelligence: 2 },
  { name: "Gourmet Feast", price: 20, strength: 3, intelligence: 3 },
];

export function FoodManagement({
  balance,
  setBalance,
  foodBag,
  setFoodBag,
}: FoodManagementProps) {
  const [activeTab, setActiveTab] = useState<"shop" | "bag">("shop");

  const buyFood = (item: FoodItem) => {
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-indigo-600">Food Management</h2>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "shop" ? "default" : "outline"}
            onClick={() => setActiveTab("shop")}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Shop
          </Button>
          <Button
            variant={activeTab === "bag" ? "default" : "outline"}
            onClick={() => setActiveTab("bag")}
          >
            <Package className="w-4 h-4 mr-2" />
            Bag
          </Button>
        </div>
      </div>

      {activeTab === "shop" ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {foodBag.map((food, index) => (
            <motion.div
              key={index}
              className="bg-indigo-50 p-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold text-lg">{food.name}</h3>
              <p className="text-gray-600">Quantity: {food.quantity}</p>
              <p className="text-gray-600">Strength +{food.strength}</p>
              <p className="text-gray-600">Intelligence +{food.intelligence}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function FoodItem({
  item,
  balance,
  onBuy,
}: {
  item: FoodItem;
  balance: number;
  onBuy: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      className="bg-indigo-50 p-4 rounded-lg"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
    >
      <h3 className="font-semibold text-lg">{item.name}</h3>
      <p className="text-gray-600">Price: {item.price} Tokens</p>
      <motion.div animate={{ opacity: hover ? 1 : 0.7 }}>
        <p className="text-gray-600">Strength +{item.strength}</p>
        <p className="text-gray-600">Intelligence +{item.intelligence}</p>
      </motion.div>
      <Button
        className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white"
        onClick={onBuy}
        disabled={balance < item.price}
      >
        Buy
      </Button>
    </motion.div>
  );
}

function GameItem({ game, setSelectedGame }) {
  return (
    <motion.div
      className="bg-indigo-50 p-4 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedGame(game)}
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

function PetCard({
  pets,
  currentPetIndex,
  setCurrentPetIndex,
  setShowFeedPopup,
}) {
  const pet = pets[currentPetIndex];

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
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <div className="flex items-center justify-center w-full h-full text-8xl">
                {pet.icon}
              </div>
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
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            onClick={() => setShowFeedPopup(true)}
          >
            Feed Pet
          </Button>
        </div>
      </div>
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
function Sidenav({ activeSection, setActiveSection, setShowBuyTokens }) {
  const navItems = [
    { id: "pets", icon: PawPrint, label: "Pets" },
    { id: "food", icon: ShoppingBag, label: "Food" },
    { id: "games", icon: Gamepad2, label: "Games" },
  ];

  return (
    <motion.div
      className="w-20 bg-white shadow-lg flex flex-col items-center py-8 space-y-8"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          className={`p-2 rounded-lg ${
            activeSection === item.id
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-600 hover:bg-gray-100"
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
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
          <h3 className="text-2xl font-bold mb-4 text-indigo-600">Feed {pet.name}</h3>
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
            <p className="text-center text-gray-600">No food available. Visit the shop to buy some!</p>
          )}
        </motion.div>
      </motion.div>
    )
  }