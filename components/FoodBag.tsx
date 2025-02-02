import { motion } from "framer-motion";
import type { FoodBagItem } from "@/types";

interface FoodBagProps {
	foodBag: FoodBagItem[];
}

export function FoodBag({ foodBag }: FoodBagProps) {
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
