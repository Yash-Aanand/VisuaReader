import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  animate,
} from "framer-motion";
import { BookOpen, Play, Pause, Eye } from "lucide-react";

export function MainContent() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const COLORS = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
  const color = useMotionValue(COLORS[0]);

  useEffect(() => {
    animate(color, COLORS, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  const handleStartDetection = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const endpoint = isDetecting ? "stop-blink" : "start-blink";
      const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (
        (isDetecting && result.status === "stopped") ||
        (!isDetecting && result.status === "started")
      ) {
        setIsDetecting(!isDetecting);
      } else if (
        result.status === "already running" ||
        result.status === "not running"
      ) {
        setIsDetecting(isDetecting);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error("Backend error:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center px-6 pt-20 pb-20">
      {/* Top-right Status Badge */}
      <div className="absolute top-6 right-6 z-50">
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-xl border-0 shadow-lg transition-all duration-300 ${
            hasError
              ? "bg-yellow-600/80 shadow-yellow-500/30"
              : isDetecting
              ? "bg-green-600/20 shadow-green-500/20"
              : "bg-red-600/20 shadow-red-500/20"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${
              hasError
                ? "bg-yellow-400 shadow-yellow-400/60"
                : isDetecting
                ? "bg-green-500 shadow-green-500/50"
                : "bg-red-500 shadow-red-500/50"
            }`}
          />
          <span className="text-xs font-medium text-white/80">
            {hasError ? "Error" : isDetecting ? "Live" : "Paused"}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-2xl mx-auto"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative group w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-75 animate-pulse" />
            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-6 rounded-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-bold mb-4 text-white"
        >
          Welcome to VisuaReader
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-white/80 mb-12"
        >
          Hands-free PDF reading, powered by your eyes.
        </motion.p>

        {/* Blink Gestures */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative mr-3">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-75" />
              <Eye className="relative w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Blink Gestures</h2>
          </div>
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />
              <span className="text-white">
                <span className="font-medium">Long Blink</span> → Go to Next Page
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0" />
              <span className="text-white">
                <span className="font-medium">Double Long Blink</span> → Go to Previous Page
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Action Button */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div className="relative inline-block group">
            {/* Glowing background */}
            <motion.div
              className="absolute inset-0 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: color }}
            />
            <motion.button
              onClick={handleStartDetection}
              disabled={isLoading}
              style={{ border, boxShadow }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-2xl px-8 py-4 font-semibold text-lg transition-all duration-300 shadow-xl text-white border-0 bg-gray-950/20 hover:bg-gray-950/40"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {isDetecting ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{isDetecting ? "Pause Detection" : "Start Detection"}</span>
                </div>
              )}
            </motion.button>
          </motion.div>

          {/* Status Message */}
          <div className="mt-4">
            <p className="text-sm text-gray-300">
              {hasError
                ? "⚠️ Unable to connect to backend. Check if server is running."
                : isDetecting
                ? "👁️ Detection is active. Start blinking to navigate!"
                : "Ready to begin hands-free reading"}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
