import React, { useState } from "react";
import { generateLogo, LogoMetadata } from "./services/gemini";
import LogoDisplay from "./components/LogoDisplay";
import { Sparkles, ArrowRight, Palette, Building2 } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<LogoMetadata | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    colors: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setLoading(true);
    try {
      const colorArr = formData.colors.split(",").map(c => c.trim()).filter(Boolean);
      const result = await generateLogo(formData.name, formData.industry, colorArr);
      setLogo(result);
      
      // Persist to backend
      await fetch("/api/logos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, logoData: result })
      });
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0EE] text-[#141414] selection:bg-[#141414] selection:text-[#F0F0EE]">
      {/* Header Grid Rail */}
      <div className="border-b border-black/10 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#141414] rounded-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#F0F0EE]" />
            </div>
            <span className="text-sm font-mono font-bold uppercase tracking-tighter">LogoCraft AI / v1.0</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest hidden md:block">Process: Neural Synthesis</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        {/* Left Side: Preview */}
        <div className="order-2 lg:order-1">
          <LogoDisplay logo={logo} loading={loading} />
        </div>

        {/* Right Side: Configuration */}
        <div className="order-1 lg:order-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-sans font-medium tracking-tight leading-[0.9]">
              Define your <br />
              <span className="italic font-serif">Visual Identity.</span>
            </h1>
            <p className="text-sm text-black/60 leading-relaxed font-sans max-w-sm">
              Our neural engine analyzes your brand essence to compute precise geometric symbols and cinematic motion paths.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-black/40 flex items-center gap-2">
                   <Building2 className="w-3 h-3" /> Company Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Lumina Tech"
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono placeholder:text-black/20"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-black/40 flex items-center gap-2">
                   <ArrowRight className="w-3 h-3" /> Industry
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sustainable Energy"
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono placeholder:text-black/20"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-black/40 flex items-center gap-2">
                   <Palette className="w-3 h-3" /> Preferred Colors
                </label>
                <input
                  type="text"
                  placeholder="e.g. Midnight Blue, Silver"
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono placeholder:text-black/20"
                  value={formData.colors}
                  onChange={e => setFormData({ ...formData, colors: e.target.value })}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="group w-full bg-[#141414] text-[#F0F0EE] py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:gap-5 hover:bg-black/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm font-mono uppercase tracking-widest">Construct Logo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* System Metadata Rail */}
          <div className="pt-8 border-t border-black/10 flex flex-col gap-4">
             <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter text-black/40">
                <span>Model: Gemini 3 Flash</span>
                <span>Mode: Vector Synthesis</span>
             </div>
             <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter text-black/40">
                <span>Latency: ~2.4s</span>
                <span>Status: Optimized</span>
             </div>
          </div>
        </div>
      </main>

      {/* Background Decorative Element */}
      <div className="fixed bottom-0 left-0 p-8 opacity-10 font-mono text-[120px] font-bold tracking-tighter pointer-events-none select-none">
        LC / 26
      </div>
    </div>
  );
}
