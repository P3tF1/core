import { motion } from "framer-motion"

interface AttributeBarProps {
  label: string
  value: number
}

export function AttributeBar({ label, value }: AttributeBarProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{label}</span>
      <div className="w-48 bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="h-2.5 rounded-full bg-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${(value / 100) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      <span className="ml-2 font-medium">{value}</span>
    </div>
  )
}

