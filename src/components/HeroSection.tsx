"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Cpu, ArrowDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between items-center px-6 pt-24 pb-8 overflow-hidden bg-slate-deep">
      {/* Central Spotlight Radial Gradient Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 45%, #2B5A6B 0%, #193948 55%, #152A35 100%)",
        }}
      />

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#5ED1C9_1px,transparent_1px),linear-gradient(to_bottom,#5ED1C9_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Hero Header Tag */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 flex items-center space-x-2 px-4 py-1.5 rounded-full border border-cyan-accent/30 bg-slate-midnight/60 backdrop-blur-sm text-cyan-accent font-mono text-xs tracking-widest uppercase"
      >
        <Cpu className="w-3.5 h-3.5" />
        <span>ENTERPRISE AI INTERVIEW SYSTEM ARCHITECTURE</span>
      </motion.div>

      {/* Main Centerpiece Composition */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center my-auto py-8">
        
        {/* Massive Condensed Background Typography */}
        <div className="relative flex flex-col items-center justify-center select-none w-full text-center">
          
          <motion.h1 
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12rem] leading-[0.8] text-cream-paper uppercase tracking-wider drop-shadow-2xl"
          >
            AI INTERVIEW
          </motion.h1>

          <motion.h1 
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12rem] leading-[0.8] text-cream-paper uppercase tracking-wider drop-shadow-2xl"
          >
            AGENT
          </motion.h1>

          {/* Overlapping Floating 3D Pixar-Style Avatar */}
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -12, 0] 
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.3 },
              scale: { duration: 0.8, delay: 0.3 },
              y: { 
                repeat: Infinity, 
                duration: 6, 
                ease: "easeInOut",
                delay: 1.1 
              } 
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 md:w-88 md:h-88 lg:w-[26rem] lg:h-[26rem] pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          >
            <div className="relative w-full h-full">
              <Image 
                src="/avatar.png"
                alt="AI Interviewer 3D Avatar"
                fill
                priority
                className="object-contain"
              />
              
              {/* Subtle Cyan Glow aura behind avatar */}
              <div className="absolute inset-0 bg-cyan-accent/20 rounded-full blur-3xl -z-10 animate-pulse-cyan" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom Metadata Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center border-t border-aqua-spotlight/40 pt-4 text-xs font-mono text-cream-muted gap-3"
      >
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-accent" />
          <span className="font-bold text-cream-paper uppercase tracking-wider">
            BUILDING THE INTERVIEWER, NOT THE INTERVIEW.
          </span>
        </div>

        <a 
          href="#introduction" 
          className="flex items-center space-x-1 text-cyan-accent hover:text-cream-paper transition-colors group cursor-pointer"
        >
          <span>SCROLL TO EXPLORE ARCHITECTURE</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </a>

        <div className="tracking-widest uppercase text-cyan-accent/90">
          STATELESS API • RAG • MCP
        </div>
      </motion.div>
    </section>
  );
}
