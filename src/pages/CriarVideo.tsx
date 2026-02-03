import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cat, Sparkles, Crown, RotateCcw, Loader2, ChevronRight, Palette, Eye, Shirt, ImageIcon, Heart, Wand2, Video, Download, RefreshCw, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useGenerateCatVideo } from "@/hooks/useGenerateCatVideo";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Cat breed options
const catTypes = [
  { id: "persian", label: "Persa", emoji: "🐱", description: "Elegante e peludo" },
  { id: "siamese", label: "Siamês", emoji: "😺", description: "Gracioso" },
  { id: "scottish", label: "Scottish Fold", emoji: "🙀", description: "Orelhas dobradas" },
  { id: "maine-coon", label: "Maine Coon", emoji: "🦁", description: "Majestoso" },
  { id: "british", label: "British Shorthair", emoji: "😸", description: "Aristocrático" },
  { id: "munchkin", label: "Munchkin", emoji: "🐈", description: "Adorável" },
  { id: "bengal", label: "Bengal", emoji: "🐆", description: "Selvagem" },
  { id: "ragdoll", label: "Ragdoll", emoji: "😻", description: "Olhos azuis" },
];

// Fur colors
const furColors = [
  { id: "orange", label: "Laranja Dourado", color: "#f97316" },
  { id: "gray", label: "Cinza Prateado", color: "#6b7280" },
  { id: "white", label: "Branco Puro", color: "#fafaf9" },
  { id: "black", label: "Preto Ébano", color: "#1c1917" },
  { id: "calico", label: "Malhado", color: "#fbbf24" },
  { id: "tuxedo", label: "Tuxedo", color: "#18181b" },
  { id: "cream", label: "Creme", color: "#fef3c7" },
  { id: "brown", label: "Marrom Chocolate", color: "#78350f" },
];

// Eye colors
const eyeColors = [
  { id: "blue", label: "Azul Safira", color: "#2563eb" },
  { id: "green", label: "Verde Esmeralda", color: "#16a34a" },
  { id: "gold", label: "Âmbar Dourado", color: "#ca8a04" },
  { id: "heterochromia", label: "Heterocromia", color: "linear-gradient(90deg, #2563eb 50%, #ca8a04 50%)" },
  { id: "copper", label: "Cobre", color: "#b45309" },
  { id: "aqua", label: "Turquesa", color: "#0891b2" },
];

// Accessories
const accessories = [
  { id: "none", label: "Nenhum", emoji: "✨" },
  { id: "crown", label: "Coroa Real", emoji: "👑" },
  { id: "wizard-hat", label: "Chapéu de Mago", emoji: "🧙" },
  { id: "bow", label: "Laço de Seda", emoji: "🎀" },
  { id: "glasses", label: "Óculos Dourados", emoji: "👓" },
  { id: "flower-crown", label: "Coroa de Flores", emoji: "🌸" },
  { id: "scarf", label: "Cachecol", emoji: "🧣" },
  { id: "superhero-cape", label: "Capa de Herói", emoji: "🦸" },
];

// Backgrounds
const backgrounds = [
  { id: "galaxy", label: "Galáxia Cósmica", emoji: "🌌", gradient: "from-purple-900 via-indigo-800 to-blue-900" },
  { id: "garden", label: "Jardim Encantado", emoji: "🌷", gradient: "from-green-600 via-emerald-500 to-teal-600" },
  { id: "sunset", label: "Pôr do Sol", emoji: "🌅", gradient: "from-orange-500 via-rose-500 to-purple-600" },
  { id: "winter", label: "Inverno Mágico", emoji: "❄️", gradient: "from-cyan-300 via-blue-300 to-indigo-400" },
  { id: "castle", label: "Castelo Fantasy", emoji: "🏰", gradient: "from-violet-600 via-purple-500 to-indigo-600" },
  { id: "beach", label: "Praia Tropical", emoji: "🏖️", gradient: "from-cyan-500 via-sky-400 to-blue-500" },
  { id: "sakura", label: "Cerejeira Japonesa", emoji: "🌸", gradient: "from-pink-400 via-rose-300 to-pink-500" },
  { id: "rainbow", label: "Arco-íris", emoji: "🌈", gradient: "from-red-400 via-yellow-400 to-green-400" },
];

// Personalities/Expressions
const personalities = [
  { id: "happy", label: "Feliz", emoji: "😊", description: "Alegre e radiante" },
  { id: "sleepy", label: "Sonolento", emoji: "😴", description: "Pacífico e calmo" },
  { id: "curious", label: "Curioso", emoji: "🧐", description: "Atento e inteligente" },
  { id: "playful", label: "Brincalhão", emoji: "😜", description: "Travesso e divertido" },
  { id: "royal", label: "Majestoso", emoji: "👑", description: "Nobre e digno" },
  { id: "shy", label: "Tímido", emoji: "🥺", description: "Doce e gentil" },
];

// Motion types for animation
const motionTypes = [
  { id: "breathing", label: "Respirando", emoji: "💨", description: "Suave movimento" },
  { id: "blinking", label: "Piscando", emoji: "👁️", description: "Piscar elegante" },
  { id: "head-tilt", label: "Inclinando Cabeça", emoji: "🐱", description: "Curioso" },
  { id: "purring", label: "Ronronando", emoji: "😻", description: "Contentamento" },
  { id: "looking-around", label: "Olhando ao Redor", emoji: "👀", description: "Olhos curiosos" },
  { id: "tail-swish", label: "Balançando Rabo", emoji: "🐾", description: "Gracioso" },
];

type Step = "breed" | "fur" | "eyes" | "accessory" | "background" | "personality" | "motion" | "generate";

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "breed", label: "Raça", icon: Cat },
  { id: "fur", label: "Pelo", icon: Palette },
  { id: "eyes", label: "Olhos", icon: Eye },
  { id: "accessory", label: "Acessório", icon: Shirt },
  { id: "background", label: "Cenário", icon: ImageIcon },
  { id: "personality", label: "Expressão", icon: Heart },
  { id: "motion", label: "Movimento", icon: Video },
  { id: "generate", label: "Criar!", icon: Wand2 },
];

const CriarVideo = () => {
  const [currentStep, setCurrentStep] = useState<Step>("breed");
  const [selectedCatType, setSelectedCatType] = useState(catTypes[0].id);
  const [selectedFurColor, setSelectedFurColor] = useState(furColors[0].id);
  const [selectedEyeColor, setSelectedEyeColor] = useState(eyeColors[0].id);
  const [selectedAccessory, setSelectedAccessory] = useState("none");
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0].id);
  const [selectedPersonality, setSelectedPersonality] = useState(personalities[0].id);
  const [selectedMotion, setSelectedMotion] = useState(motionTypes[0].id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { isGenerating, generatedImage, generateVideo, resetGeneration } = useGenerateCatVideo();
  const { user, subscription, canGenerate, remainingGenerations, refreshSubscription, isLoading } = useAuth();

  // Check for success query param (after Stripe checkout)
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Assinatura Premium ativada! 🎉 Agora você pode gerar vídeos ilimitados!");
      refreshSubscription();
      // Clean up URL
      navigate("/criar-video", { replace: true });
    }
  }, [searchParams, navigate, refreshSubscription]);

  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step);

  const nextStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleReset = () => {
    setSelectedCatType(catTypes[0].id);
    setSelectedFurColor(furColors[0].id);
    setSelectedEyeColor(eyeColors[0].id);
    setSelectedAccessory("none");
    setSelectedBackground(backgrounds[0].id);
    setSelectedPersonality(personalities[0].id);
    setSelectedMotion(motionTypes[0].id);
    setCurrentStep("breed");
    resetGeneration();
  };

  const handleGenerateVideo = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Você precisa fazer login para gerar imagens!");
      navigate("/login");
      return;
    }

    // Check if user can generate
    if (!canGenerate) {
      toast.error("Você atingiu o limite de 3 gerações gratuitas! Assine o Premium para continuar.");
      navigate("/assinar-premium");
      return;
    }

    const selectedBreed = catTypes.find(c => c.id === selectedCatType);
    const selectedFur = furColors.find(c => c.id === selectedFurColor);
    const selectedEye = eyeColors.find(c => c.id === selectedEyeColor);
    const selectedAcc = accessories.find(a => a.id === selectedAccessory);
    const selectedBg = backgrounds.find(b => b.id === selectedBackground);
    const selectedPers = personalities.find(p => p.id === selectedPersonality);
    const selectedMot = motionTypes.find(m => m.id === selectedMotion);

    const result = await generateVideo({
      breed: selectedBreed?.label || "Persian",
      furColor: selectedFur?.label || "Orange",
      eyeColor: selectedEye?.label || "Blue",
      accessory: selectedAcc?.label || "none",
      background: selectedBg?.label || "Galaxy",
      personality: selectedPers?.label || "Happy",
      motion: selectedMot?.label || "Breathing",
    });

    // If generation was successful, increment the counter
    if (result?.success) {
      await supabase.functions.invoke("increment-generation");
      refreshSubscription();
    }
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `gatinho-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Imagem baixada! 📥");
    }
  };

  const handleSubscribe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Erro ao iniciar checkout. Tente novamente.");
    }
  };

  const getSelectedFurColor = () => furColors.find(c => c.id === selectedFurColor);

  const isPremium = subscription?.subscribed ?? false;

  const renderStepContent = () => {
    switch (currentStep) {
      case "breed":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Escolha a Raça 🐱</h2>
              <p className="text-muted-foreground">Qual felino será eternizado em vídeo?</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {catTypes.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCatType(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCatType === cat.id
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <span className="text-4xl block mb-2">{cat.emoji}</span>
                  <span className="font-semibold block">{cat.label}</span>
                  <span className="text-xs text-muted-foreground">{cat.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "fur":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Cor da Pelagem 🎨</h2>
              <p className="text-muted-foreground">Escolha os tons para seu gatinho</p>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {furColors.map((fur) => (
                <motion.button
                  key={fur.id}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFurColor(fur.id)}
                  className={`aspect-square rounded-full border-4 transition-all shadow-lg ${
                    selectedFurColor === fur.id
                      ? "border-primary ring-4 ring-primary/30 scale-110"
                      : "border-border/50 hover:border-primary/50"
                  }`}
                  style={{ backgroundColor: fur.color }}
                  title={fur.label}
                />
              ))}
            </div>
            <p className="text-center font-medium text-lg">{getSelectedFurColor()?.label}</p>
          </div>
        );

      case "eyes":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Cor dos Olhos 👁️</h2>
              <p className="text-muted-foreground">Os olhos são a alma do vídeo</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {eyeColors.map((eye) => (
                <motion.button
                  key={eye.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEyeColor(eye.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    selectedEyeColor === eye.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className="w-14 h-14 rounded-full border-4 border-stone-800 shadow-inner"
                    style={{ background: eye.color }}
                  />
                  <span className="text-sm mt-2 font-medium">{eye.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "accessory":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Acessório ✨</h2>
              <p className="text-muted-foreground">Adicione um toque especial</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {accessories.map((acc) => (
                <motion.button
                  key={acc.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAccessory(acc.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAccessory === acc.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-3xl block mb-1">{acc.emoji}</span>
                  <span className="text-sm font-medium">{acc.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "background":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Cenário 🌟</h2>
              <p className="text-muted-foreground">Onde seu gatinho estará?</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {backgrounds.map((bg) => (
                <motion.button
                  key={bg.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBackground(bg.id)}
                  className={`p-4 rounded-xl border-2 transition-all bg-gradient-to-br ${bg.gradient} ${
                    selectedBackground === bg.id
                      ? "border-primary ring-4 ring-primary/30"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <span className="text-3xl block mb-1">{bg.emoji}</span>
                  <span className="text-sm font-semibold text-primary-foreground drop-shadow-lg">{bg.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "personality":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Expressão 😺</h2>
              <p className="text-muted-foreground">Como seu gatinho está se sentindo?</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {personalities.map((p) => (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPersonality(p.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedPersonality === p.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-4xl block mb-1">{p.emoji}</span>
                  <span className="text-sm font-medium">{p.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "motion":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Movimento 🎬</h2>
              <p className="text-muted-foreground">Como seu gatinho vai se movimentar?</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {motionTypes.map((m) => (
                <motion.button
                  key={m.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMotion(m.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedMotion === m.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-4xl block mb-2">{m.emoji}</span>
                  <span className="font-semibold block">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "generate":
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">
              {generatedImage ? "Seu Gatinho Ficou Lindo! 🎉" : "Pronto para criar! 🎉"}
            </h2>
            <p className="text-muted-foreground">
              {generatedImage 
                ? "Sua imagem foi gerada com IA ultra-realista!"
                : "Seu gatinho está configurado. Clique no botão para gerar!"
              }
            </p>
            
            {/* Show login prompt if not logged in */}
            {!user && !isLoading && (
              <Card className="p-6 bg-amber-500/10 border-amber-500/30">
                <div className="flex items-center justify-center gap-2 text-amber-600 mb-3">
                  <LogIn className="w-5 h-5" />
                  <span className="font-semibold">Faça login para gerar</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Você precisa estar logado para gerar imagens de gatinhos!
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/login">
                    <Button>Fazer Login</Button>
                  </Link>
                  <Link to="/cadastro">
                    <Button variant="outline">Criar Conta</Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Show limit warning for free users */}
            {user && !isPremium && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {canGenerate ? (
                    <>
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary">
                        {remainingGenerations === 1 
                          ? "Última geração gratuita!" 
                          : `${remainingGenerations} gerações restantes`}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 text-destructive" />
                      <span className="font-semibold text-destructive">
                        Limite atingido!
                      </span>
                    </>
                  )}
                </div>
                {!canGenerate && (
                  <Button onClick={handleSubscribe} className="btn-gradient text-primary-foreground mt-2">
                    <Crown className="w-4 h-4 mr-2" />
                    Assinar Premium - R$ 9,80/mês
                  </Button>
                )}
              </Card>
            )}

            {/* Show premium badge */}
            {isPremium && (
              <Card className="p-4 bg-accent/10 border-accent/30">
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-accent" />
                  <span className="font-semibold text-accent">
                    Premium Ativo - Gerações Ilimitadas! ✨
                  </span>
                </div>
              </Card>
            )}
            
            {generatedImage ? (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden border-4 border-primary/30 shadow-2xl"
                >
                  <img 
                    src={generatedImage} 
                    alt="Gatinho gerado com IA" 
                    className="w-full max-w-lg mx-auto"
                  />
                </motion.div>
                
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button
                    onClick={handleDownloadImage}
                    className="btn-gradient text-primary-foreground"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Imagem
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGenerateVideo}
                    disabled={isGenerating || !canGenerate}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Gerar Novamente
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Novo Gatinho
                  </Button>
                </div>
              </div>
            ) : (
              user && (
                <>
                  <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                    <div className="text-6xl mb-4">🐱✨</div>
                    <p className="font-medium">
                      Raça: {catTypes.find(c => c.id === selectedCatType)?.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pelo: {furColors.find(c => c.id === selectedFurColor)?.label} • 
                      Olhos: {eyeColors.find(c => c.id === selectedEyeColor)?.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cenário: {backgrounds.find(b => b.id === selectedBackground)?.label}
                    </p>
                  </Card>

                  <Button
                    size="lg"
                    onClick={handleGenerateVideo}
                    disabled={isGenerating || !canGenerate}
                    className="btn-gradient text-primary-foreground font-bold text-lg px-8 py-6 rounded-2xl"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Gerando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Gerar Imagem com IA
                      </>
                    )}
                  </Button>
                </>
              )
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Cat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">Gat.AI</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
            {isPremium ? (
              <Button variant="outline" size="sm" className="border-accent text-accent">
                <Crown className="w-4 h-4 mr-2" />
                Premium ✓
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-accent text-accent"
                onClick={handleSubscribe}
              >
                <Crown className="w-4 h-4 mr-2" />
                Assinar Premium
              </Button>
            )}
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
                Sair
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Step Progress */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-center gap-2 min-w-max">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isPast = getStepIndex(currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isPast
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                    <span className="text-sm font-medium hidden md:inline">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === "breed"}
              >
                Voltar
              </Button>
              {currentStep !== "generate" && (
                <Button onClick={nextStep} className="btn-gradient text-primary-foreground">
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CriarVideo;
