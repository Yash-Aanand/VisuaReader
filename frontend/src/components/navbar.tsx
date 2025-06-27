import { useState } from "react";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const [isActive] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">
            VisuaReader
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-white/80">
            {isActive ? 'Live' : 'Paused'}
          </span>
        </div>
      </div>
    </motion.nav>
  );
}