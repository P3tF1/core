import { motion } from "framer-motion";
import {
	PawPrint,
	ShoppingBag,
	Gamepad2,
	ShoppingCart,
	Coins,
} from "lucide-react";

interface SidenavProps {
	activeSection: string;
	setActiveSection: (section: string) => void;
	setShowBuyTokens: (show: boolean) => void;
}

export function Sidenav({
	activeSection,
	setActiveSection,
	setShowBuyTokens,
}: SidenavProps) {
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
