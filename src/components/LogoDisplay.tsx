import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { LogoMetadata } from "../services/gemini";

interface LogoDisplayProps {
  logo: LogoMetadata | null;
  loading: boolean;
}

export default function LogoDisplay({ logo, loading }: LogoDisplayProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-black/10 rounded-xl bg-white/50 backdrop-blur-sm h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-black/40" />
        </motion.div>
        <p className="mt-4 text-sm font-mono uppercase tracking-widest text-black/40">Synthesizing Brand Identity...</p>
      </div>
    );
  }

  if (!logo) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-black/20 rounded-xl bg-black/[0.02] h-[400px]">
        <p className="text-sm font-mono uppercase tracking-widest text-black/30">Logo Preview Area</p>
      </div>
    );
  }

  const getAnimation = () => {
    switch (logo.animation.type) {
      case "spin":
        return { rotate: 360 };
      case "pulse":
        return { scale: [1, 1.05, 1] };
      case "float":
        return { y: [0, -10, 0] };
      default:
        return { opacity: [0, 1] };
    }
  };

  const transition = {
    duration: logo.animation.duration,
    repeat: Infinity,
    ease: "easeInOut",
    delay: logo.animation.delay
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="relative group p-12 border border-black/10 rounded-xl bg-white shadow-2xl shadow-black/5 overflow-hidden flex items-center justify-center h-[400px]">
        {/* Visual Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        <motion.div
           layoutId="logo-view"
           animate={getAnimation()}
           transition={transition}
           dangerouslySetInnerHTML={{ __html: logo.svg }}
           className="w-48 h-48 drop-shadow-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-black/10 rounded-lg bg-black/[0.02]">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-black/40 mb-3">Design Rationale</h4>
          <p className="text-sm text-black/70 leading-relaxed font-sans italic">"{logo.rationale}"</p>
        </div>
        <div className="p-4 border border-black/10 rounded-lg bg-black/[0.02]">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-black/40 mb-3">Palette Analysis</h4>
          <div className="flex gap-2">
            {logo.brandColors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full border border-black/5" style={{ backgroundColor: color }} />
                <span className="text-[9px] font-mono text-black/40 uppercase">{color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
