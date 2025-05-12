import { motion, AnimatePresence } from "framer-motion";

interface NavigationProgressProps {
  isPending: boolean;
  duration?: number;
  height?: string;
  barColor?: string;
  progressColor?: string;
}

export default function NavigationProgress({
  isPending,
  duration = 1,
  height = "h-1",
  barColor = "bg-blue-500",
  progressColor = "bg-blue-600",
}: NavigationProgressProps) {
  return (
    <AnimatePresence>
      {isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed top-0 left-0 w-full ${height} ${barColor}`}
        >
          <motion.div
            className={`h-full ${progressColor}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
