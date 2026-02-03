import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, RotateCcw } from "lucide-react";

interface AnimatedCatVideoProps {
  imageUrl: string;
  motionType: string;
  onDownload?: () => void;
}

const motionVariants: Record<string, { scale?: number[]; rotate?: number[]; x?: number[]; y?: number[]; opacity?: number[] }> = {
  breathing: {
    scale: [1, 1.02, 1],
  },
  blinking: {
    opacity: [1, 0.95, 1],
    scale: [1, 1.01, 1],
  },
  "head-tilt": {
    rotate: [0, -3, 3, 0],
    scale: [1, 1.01, 1.01, 1],
  },
  purring: {
    scale: [1, 1.015, 0.99, 1.015, 1],
    y: [0, -2, 0, -2, 0],
  },
  "looking-around": {
    x: [0, 8, 0, -8, 0],
  },
  "tail-swish": {
    rotate: [0, 2, -2, 2, 0],
  },
};

const motionDurations: Record<string, number> = {
  breathing: 3,
  blinking: 2.5,
  "head-tilt": 4,
  purring: 1.5,
  "looking-around": 5,
  "tail-swish": 2,
};

export const AnimatedCatVideo = ({ imageUrl, motionType, onDownload }: AnimatedCatVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxDuration = 8; // 8 seconds

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxDuration) {
            return 0; // Loop back
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const restart = () => {
    setDuration(0);
    setIsPlaying(true);
  };

  const progressPercent = (duration / maxDuration) * 100;
  const currentMotion = motionVariants[motionType] || motionVariants.breathing;
  const currentDuration = motionDurations[motionType] || 3;

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative rounded-2xl overflow-hidden border-4 border-primary/30 shadow-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        {/* Ambient background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          animate={isPlaying ? { 
            opacity: [0.3, 0.6, 0.3],
          } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundSize: "200% 200%" }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              style={{
                left: `${15 + i * 15}%`,
                bottom: `${10 + (i % 3) * 20}%`,
              }}
              animate={isPlaying ? {
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8],
              } : undefined}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Glowing border effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-primary/20"
          animate={
            isPlaying
              ? {
                  opacity: [0.3, 0.6, 0.3],
                }
              : undefined
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main animated image */}
        <motion.div
          className="relative z-10"
          animate={isPlaying ? currentMotion : undefined}
          transition={{
            duration: currentDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Subtle zoom effect overlay */}
          <motion.div
            animate={
              isPlaying
                ? {
                    scale: [1, 1.05, 1],
                  }
                : undefined
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={imageUrl}
              alt="Gatinho animado com IA"
              className="w-full max-w-lg mx-auto"
            />
          </motion.div>
        </motion.div>

        {/* Video overlay badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/60 backdrop-blur-sm text-background text-sm font-medium"
            animate={isPlaying ? { opacity: [0.8, 1, 0.8] } : undefined}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-destructive"
              animate={isPlaying ? { scale: [1, 1.3, 1] } : undefined}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {isPlaying ? "AO VIVO" : "PAUSADO"}
          </motion.div>
        </div>

        {/* Duration badge */}
        <div className="absolute top-3 right-3">
          <div className="px-3 py-1.5 rounded-full bg-foreground/60 backdrop-blur-sm text-background text-sm font-mono">
            {duration.toFixed(1)}s / {maxDuration}s
          </div>
        </div>

        {/* Play/Pause overlay */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-foreground/30 backdrop-blur-sm z-20"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-background/90 flex items-center justify-center shadow-2xl"
            >
              <Play className="w-8 h-8 text-primary ml-1" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button
          variant="outline"
          size="lg"
          onClick={togglePlay}
          className="gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Reproduzir
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={restart}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reiniciar
        </Button>

        {onDownload && (
          <Button
            size="lg"
            onClick={onDownload}
            className="btn-gradient text-primary-foreground gap-2"
          >
            <Download className="w-4 h-4" />
            Baixar Imagem
          </Button>
        )}
      </div>

      {/* Info text */}
      <p className="text-center text-sm text-muted-foreground">
        🎬 Vídeo animado de 8 segundos • Efeito: {motionType.replace("-", " ")}
      </p>
    </div>
  );
};
