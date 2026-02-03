import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GenerationOptions {
  breed: string;
  furColor: string;
  eyeColor: string;
  accessory: string;
  background: string;
  personality: string;
  motion: string;
}

interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  message?: string;
  error?: string;
}

export const useGenerateCatVideo = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateVideo = async (options: GenerationOptions): Promise<GenerationResult | null> => {
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke<GenerationResult>(
        "generate-cat-video",
        {
          body: options,
        }
      );

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Erro ao gerar imagem. Tente novamente.");
        return null;
      }

      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Limite de requisições atingido. Aguarde um momento.");
        } else if (data.error.includes("Payment required")) {
          toast.error("Créditos insuficientes. Adicione créditos à sua conta.");
        } else {
          toast.error(data.error);
        }
        return null;
      }

      if (data?.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("Imagem gerada com sucesso! 🐱");
        return data;
      }

      return null;
    } catch (err) {
      console.error("Generation error:", err);
      toast.error("Erro inesperado. Tente novamente.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const resetGeneration = () => {
    setGeneratedImage(null);
  };

  return {
    isGenerating,
    generatedImage,
    generateVideo,
    resetGeneration,
  };
};
