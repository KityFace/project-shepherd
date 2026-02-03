import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, RotateCcw, Sparkles } from "lucide-react";

interface AnimatedCatVideoProps {
  imageUrl: string;
  motionType: string;
  onDownload?: () => void;
}

const motionVariants: Record<string, { scale?: number[]; rotate?: number[]; x?: number[]; y?: number[]; filter?: string[] }> = {
  breathing: {
    scale: [1, 1.03, 1.01, 1.025, 1],
    y: [0, -3, 0, -2, 0],
  },
  blinking: {
    scale: [1, 1.02, 1, 1.015, 1],
    filter: ["brightness(1)", "brightness(0.95)", "brightness(1)", "brightness(0.98)", "brightness(1)"],
  },
  "head-tilt": {
    rotate: [0, -4, 2, -2, 4, 0],
    scale: [1, 1.02, 1.01, 1.02, 1.01, 1],
    y: [0, -2, 0, -1, 0, 0],
  },
  purring: {
    scale: [1, 1.02, 0.99, 1.02, 0.99, 1.015, 1],
    y: [0, -3, 0, -2, 0, -2, 0],
    x: [0, 1, -1, 0, 1, -1, 0],
  },
  "looking-around": {
    x: [0, 12, 0, -12, 6, -6, 0],
    y: [0, -2, 0, -2, 0, -1, 0],
    rotate: [0, 2, 0, -2, 1, -1, 0],
  },
  "tail-swish": {
    rotate: [0, 3, -3, 2, -2, 1, 0],
    scale: [1, 1.01, 1.01, 1.02, 1.01, 1.01, 1],
  },
};

export const AnimatedCatVideo = ({ imageUrl, motionType, onDownload }: AnimatedCatVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxDuration = 8;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => (prev >= maxDuration ? 0 : prev + 0.1));
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const restart = () => {
    setDuration(0);
    setIsPlaying(true);
  };

  const progressPercent = (duration / maxDuration) * 100;
  const currentMotion = motionVariants[motionType] || motionVariants.breathing;

  return (
    <div className="space-y-4">
      {/* Video Container with Ken Burns effect */}
      <div className="relative rounded-2xl overflow-hidden border-4 border-primary/30 shadow-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        {/* Cinematic ambient glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"
          animate={isPlaying ? { opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating sparkle particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${15 + Math.floor(i / 4) * 30}%`,
              }}
              animate={isPlaying ? {
                y: [0, -30 - i * 5, 0],
                x: [0, Math.sin(i) * 15, 0],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.2, 0.5],
                rotate: [0, 180, 360],
              } : undefined}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              <Sparkles className="w-3 h-3 text-primary/60" />
            </motion.div>
          ))}
        </div>

        {/* Ken Burns zoom effect container */}
        <motion.div
          className="relative z-10"
          animate={isPlaying ? {
            scale: [1, 1.08, 1.04, 1.1, 1.06, 1],
            x: [0, 10, -5, 8, -3, 0],
            y: [0, -8, 5, -10, 3, 0],
          } : undefined}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Character motion layer */}
          <motion.div
            animate={isPlaying ? currentMotion : undefined}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Subtle breathing shadow */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-foreground/10 rounded-full blur-xl"
              animate={isPlaying ? { scaleX: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] } : undefined}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <img
              src={imageUrl}
              alt="Gatinho animado com IA"
              className="w-full max-w-lg mx-auto relative z-10"
            />
          </motion.div>
        </motion.div>

        {/* Film grain overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-radial from-transparent via-transparent to-foreground/20" />

        {/* Recording badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-40">
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/70 backdrop-blur-md text-background text-sm font-medium shadow-lg"
            animate={isPlaying ? { opacity: [0.9, 1, 0.9] } : undefined}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-destructive"
              animate={isPlaying ? { scale: [1, 1.4, 1], opacity: [1, 0.7, 1] } : undefined}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            {isPlaying ? "GRAVANDO" : "PAUSADO"}
          </motion.div>
        </div>

        {/* Duration badge */}
        <div className="absolute top-3 right-3 z-40">
          <div className="px-3 py-1.5 rounded-full bg-foreground/70 backdrop-blur-md text-background text-sm font-mono shadow-lg">
            {duration.toFixed(1)}s / {maxDuration}s
          </div>
        </div>

        {/* Quality badge */}
        <div className="absolute bottom-3 right-3 z-40">
          <div className="px-2 py-1 rounded bg-foreground/70 backdrop-blur-md text-background text-xs font-bold">
            4K • 30fps
          </div>
        </div>

        {/* Play overlay */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-foreground/40 backdrop-blur-sm z-50"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-background/95 flex items-center justify-center shadow-2xl border-2 border-primary/30"
              >
                <Play className="w-8 h-8 text-primary ml-1" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
          style={{ width: `${progressPercent}%` }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent" />
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="outline" size="lg" onClick={togglePlay} className="gap-2">
          {isPlaying ? <><Pause className="w-4 h-4" /> Pausar</> : <><Play className="w-4 h-4" /> Reproduzir</>}
        </Button>
        <Button variant="outline" size="lg" onClick={restart} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Reiniciar
        </Button>
        {onDownload && (
          <Button size="lg" onClick={onDownload} className="btn-gradient text-primary-foreground gap-2">
            <Download className="w-4 h-4" /> Baixar Imagem
          </Button>
        )}
      </div>

      {/* Info */}
      <p className="text-center text-sm text-muted-foreground">
        🎬 Animação cinematográfica 8s • Efeito: {motionType.replace("-", " ")} • Ken Burns + Partículas
      </p>
    </div>
  );
};
