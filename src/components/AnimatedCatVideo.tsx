import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AnimatedCatVideoProps {
  imageUrl: string;
  motionType: string;
  onDownload?: () => void;
}

export const AnimatedCatVideo = ({ imageUrl, onDownload }: AnimatedCatVideoProps) => {
  return (
    <div className="space-y-4">
      {/* Image Container */}
      <div className="relative rounded-2xl overflow-hidden border-4 border-primary/30 shadow-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <img
          src={imageUrl}
          alt="Gatinho gerado com IA"
          className="w-full max-w-lg mx-auto"
        />
      </div>

      {/* Download button */}
      {onDownload && (
        <div className="flex justify-center">
          <Button size="lg" onClick={onDownload} className="btn-gradient text-primary-foreground gap-2">
            <Download className="w-4 h-4" /> Baixar Imagem
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        🐱 Imagem gerada com IA
      </p>
    </div>
  );
};
