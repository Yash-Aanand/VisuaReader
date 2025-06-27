import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed bottom-6 left-0 right-0 z-40"
    >
      <div className="text-center">
        <p className="text-white/60 text-sm">
          Built by <span className="text-white font-medium">Yash</span> • 2025
        </p>
      </div>
    </motion.footer>
  );
}