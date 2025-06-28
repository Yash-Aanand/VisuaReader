import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed bottom-6 left-0 right-0 z-40"
    >
      <div className="flex justify-center items-center gap-2 text-white/60 text-sm">
        <p>
          Built by{" "}
          <a
            href="https://yashaanand.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-medium hover:underline"
            title="Visit Yash's Website"
          >
            Yash
          </a>
        </p>
        <span className="mx-2">•</span>
        <a
          href="https://github.com/Yash-Aanand"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-white transition-transform duration-200 ease-in-out hover:scale-110"
        >
          <Github className="h-4 w-4" />
          <span className="text-xs">GitHub</span>
        </a>
        <span className="mx-2">•</span>
        <a
          href="https://www.linkedin.com/in/yash-aanand-35192b273/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-white transition-transform duration-200 ease-in-out hover:scale-110"
        >
          <Linkedin className="h-4 w-4" />
          <span className="text-xs">LinkedIn</span>
        </a>
      </div>
    </motion.footer>
  );
}
