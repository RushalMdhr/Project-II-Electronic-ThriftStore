import { motion } from 'framer-motion';

export default function LoadingScreen({setIsLoading}) {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/30 to-emerald-100" />

      {/* Animated filling box */}
      <div className="relative w-48 h-48 border-4 border-emerald-400 rounded-xl overflow-hidden shadow-emerald-500 shadow-lg">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          // transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
          transition={{ duration: 3, ease: 'easeInOut'}}
          className="absolute bottom-0 left-0 w-full bg-emerald-500"
          onAnimationComplete={()=>setIsLoading(false)}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-xl font-semibold tracking-wide">Loading...</h1>
        </div>
      </div>

      {/* Slogan */}
      <p className="mt-6 text-emerald-300 text-sm tracking-wide italic">
        Sell your old electronics and earn smartly ⚡
      </p>
    </div>
  );
}
