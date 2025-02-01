import type React from "react"

const BackgroundScene: React.FC = () => {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-green-400">
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-yellow-700 to-transparent" />
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-75" />
        </div>
    )
}

export default BackgroundScene

