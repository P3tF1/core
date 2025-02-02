import { motion } from "framer-motion";
import { PawPrint, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
	balance: number;
}

export function Navbar({ balance }: NavbarProps) {
	return (
		<motion.nav
			className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md py-4 px-8 sticky top-0 z-10"
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
					<PawPrint className="w-8 h-8 text-yellow-400" />
					<span className="text-2xl font-bold text-yellow-400">PetFi</span>
				</motion.div>
				<div className="flex items-center space-x-4">
					<motion.div
						className="bg-indigo-700 rounded-full py-2 px-4 flex items-center"
						whileHover={{ scale: 1.05 }}
					>
						<Coins className="w-5 h-5 text-yellow-400 mr-2" />
						<span className="font-semibold">{balance} PetFi</span>
					</motion.div>
					<Button variant="ghost" className="text-white hover:text-yellow-400">
						<appkit-button />
					</Button>
				</div>
			</div>
		</motion.nav>
	);
}
