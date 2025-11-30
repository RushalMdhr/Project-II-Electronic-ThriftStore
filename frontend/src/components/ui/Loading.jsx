import { motion } from "framer-motion";

export default function LoadingScreen({ setIsLoading }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
        <p className="mt-4 text-gray-300">Loading orders...</p>
      </div>
    </div>
  );
}
