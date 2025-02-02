import { ShoppingBag, Map ,Rocket} from "lucide-react";

export const testImageLink =
	"https://fastly.picsum.photos/id/728/200/300.jpg?hmac=J-q7xv6gzVRQmKunEBaFotw4F0dJ1Q6OnjN85VoBk8o";

export const games = [
	{
		name: "Rock Breaker",
		description: "Break as many rocks as you can before time runs out!",
		strategy: "Develop a rhythm and aim for combos to maximize points.",
		benefits: "Boosts your pet's strength and endurance.",
		icon: ShoppingBag,
		url: "/games/rock-breaker",
	},
	{
		name: "Pathfinder",
		description: "Navigate the maze and reach the goal as quickly as possible!",
		strategy: "Plan your moves efficiently and use the shortest path to win.",
		benefits: "Enhances problem-solving skills and spatial awareness.",
		icon: Map,
		url: "/games/pathfinder",
	},
	{
		name: "Asteroid Miner",
		description: "Break Asteroid using spaceship before it touches ground.",
		strategy: "Develop a rhythm and aim for combos to maximize points.",
		benefits: "Boosts your pet's strength and intelligence.",
		icon: Rocket,
		url: "/games/asteroid-miner",

	}
];

export const samplePetsForTrade = [
	{
		id: 101,
		name: "Luna",
		type: "Unicorn",
		level: 8,
		strength: 15,
		intelligence: 18,
		image: testImageLink,
		price: 500,
	},
	{
		id: 102,
		name: "Rex",
		type: "T-Rex",
		level: 10,
		strength: 20,
		intelligence: 12,
		image: testImageLink,
		price: 750,
	},
	{
		id: 103,
		name: "Nessie",
		type: "Sea Monster",
		level: 12,
		strength: 18,
		intelligence: 16,
		image: testImageLink,
		price: 1000,
	},
];
