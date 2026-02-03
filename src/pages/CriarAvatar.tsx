import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cat, Sparkles, Download, Crown, LogOut, Wand2, RotateCcw, Loader2, ChevronRight, Palette, Eye, Shirt, ImageIcon, Heart } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Cat breed options
const catTypes = [
  { id: "persian", label: "Persa", emoji: "🐱", description: "Fofo e peludo" },
  { id: "siamese", label: "Siamês", emoji: "😺", description: "Elegante" },
  { id: "scottish", label: "Scottish Fold", emoji: "🙀", description: "Orelhas dobradas" },
  { id: "maine-coon", label: "Maine Coon", emoji: "🦁", description: "Majestoso" },
  { id: "british", label: "British Shorthair", emoji: "😸", description: "Redondinho" },
  { id: "munchkin", label: "Munchkin", emoji: "🐈", description: "Perninhas curtas" },
  { id: "bengal", label: "Bengal", emoji: "🐆", description: "Exótico" },
  { id: "ragdoll", label: "Ragdoll", emoji: "😻", description: "Olhos azuis" },
];

// Fur colors
const furColors = [
  { id: "orange", label: "Laranja", color: "#f97316" },
  { id: "gray", label: "Cinza", color: "#6b7280" },
  { id: "white", label: "Branco", color: "#f5f5f4" },
  { id: "black", label: "Preto", color: "#1c1917" },
  { id: "calico", label: "Malhado", color: "#fbbf24" },
  { id: "tuxedo", label: "Tuxedo", color: "#18181b" },
  { id: "cream", label: "Creme", color: "#fef3c7" },
  { id: "brown", label: "Marrom", color: "#92400e" },
];

// Eye colors
const eyeColors = [
  { id: "blue", label: "Azul", color: "#3b82f6" },
  { id: "green", label: "Verde", color: "#22c55e" },
  { id: "gold", label: "Dourado", color: "#eab308" },
  { id: "heterochromia", label: "Heterocromia", color: "linear-gradient(90deg, #3b82f6 50%, #eab308 50%)" },
  { id: "copper", label: "Cobre", color: "#b45309" },
  { id: "aqua", label: "Aqua", color: "#06b6d4" },
];

// Accessories
const accessories = [
  { id: "none", label: "Nenhum", emoji: "❌" },
  { id: "crown", label: "Coroa Real", emoji: "👑" },
  { id: "wizard-hat", label: "Chapéu de Mago", emoji: "🧙" },
  { id: "bow", label: "Laço Fofo", emoji: "🎀" },
  { id: "glasses", label: "Óculos", emoji: "👓" },
  { id: "flower-crown", label: "Coroa de Flores", emoji: "🌸" },
  { id: "scarf", label: "Cachecol", emoji: "🧣" },
  { id: "superhero-cape", label: "Capa de Herói", emoji: "🦸" },
];

// Backgrounds
const backgrounds = [
  { id: "galaxy", label: "Galáxia", emoji: "🌌", gradient: "from-purple-900 via-indigo-800 to-blue-900" },
  { id: "garden", label: "Jardim", emoji: "🌷", gradient: "from-green-400 via-emerald-300 to-teal-400" },
  { id: "sunset", label: "Pôr do Sol", emoji: "🌅", gradient: "from-orange-400 via-pink-400 to-purple-500" },
  { id: "winter", label: "Inverno", emoji: "❄️", gradient: "from-cyan-200 via-blue-200 to-indigo-300" },
  { id: "castle", label: "Castelo", emoji: "🏰", gradient: "from-violet-400 via-purple-400 to-indigo-500" },
  { id: "beach", label: "Praia", emoji: "🏖️", gradient: "from-cyan-400 via-sky-300 to-blue-400" },
  { id: "sakura", label: "Sakura", emoji: "🌸", gradient: "from-pink-300 via-rose-200 to-pink-400" },
  { id: "rainbow", label: "Arco-íris", emoji: "🌈", gradient: "from-red-400 via-yellow-300 to-green-400" },
];

// Personalities/Expressions
const personalities = [
  { id: "happy", label: "Feliz", emoji: "😊" },
  { id: "sleepy", label: "Sonolento", emoji: "😴" },
  { id: "curious", label: "Curioso", emoji: "🧐" },
  { id: "playful", label: "Brincalhão", emoji: "😜" },
  { id: "royal", label: "Real", emoji: "👑" },
  { id: "shy", label: "Tímido", emoji: "🥺" },
];

// Art styles
const artStyles = [
  { id: "anime", label: "Anime", emoji: "🎌", description: "Estilo kawaii japonês" },
  { id: "realistic", label: "Realista", emoji: "📷", description: "Como uma foto" },
  { id: "chibi", label: "Chibi", emoji: "🎎", description: "Super fofo" },
  { id: "watercolor", label: "Aquarela", emoji: "🎨", description: "Artístico" },
  { id: "pixel", label: "Pixel Art", emoji: "👾", description: "Retrô" },
  { id: "3d", label: "3D Pixar", emoji: "🎬", description: "Estilo animação" },
];

type Step = "breed" | "fur" | "eyes" | "accessory" | "background" | "personality" | "style" | "generate";

const steps: { id: Step; label: string; icon: any }[] = [
  { id: "breed", label: "Raça", icon: Cat },
  { id: "fur", label: "Pelo", icon: Palette },
  { id: "eyes", label: "Olhos", icon: Eye },
  { id: "accessory", label: "Acessório", icon: Shirt },
  { id: "background", label: "Fundo", icon: ImageIcon },
  { id: "personality", label: "Expressão", icon: Heart },
  { id: "style", label: "Estilo", icon: Sparkles },
  { id: "generate", label: "Criar!", icon: Wand2 },
];

const CriarAvatar = () => {
  const [currentStep, setCurrentStep] = useState<Step>("breed");
  const [selectedCatType, setSelectedCatType] = useState(catTypes[0].id);
  const [selectedFurColor, setSelectedFurColor] = useState(furColors[0].id);
  const [selectedEyeColor, setSelectedEyeColor] = useState(eyeColors[0].id);
  const [selectedAccessory, setSelectedAccessory] = useState("none");
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0].id);
  const [selectedPersonality, setSelectedPersonality] = useState(personalities[0].id);
  const [selectedStyle, setSelectedStyle] = useState(artStyles[0].id);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

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
    setSelectedStyle(artStyles[0].id);
    setGeneratedImage(null);
    setCurrentStep("breed");
  };

  const handleGenerate = async () => {
    toast.info("Ative o Lovable Cloud para usar a geração de avatares com IA! 🐱");
  };

  const getSelectedFurColor = () => furColors.find(c => c.id === selectedFurColor);

  const renderStepContent = () => {
    switch (currentStep) {
      case "breed":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Escolha a Raça 🐱</h2>
            <p className="text-muted-foreground text-center">Qual tipo de gatinho você quer criar?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {catTypes.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCatType(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCatType === cat.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
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
            <h2 className="text-2xl font-bold text-center">Cor do Pelo 🎨</h2>
            <p className="text-muted-foreground text-center">Escolha a pelagem do seu gatinho</p>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {furColors.map((fur) => (
                <motion.button
                  key={fur.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFurColor(fur.id)}
                  className={`aspect-square rounded-full border-4 transition-all ${
                    selectedFurColor === fur.id
                      ? "border-primary ring-4 ring-primary/30"
                      : "border-transparent hover:border-primary/50"
                  }`}
                  style={{ backgroundColor: fur.color }}
                  title={fur.label}
                />
              ))}
            </div>
            <p className="text-center font-medium">{getSelectedFurColor()?.label}</p>
          </div>
        );

      case "eyes":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Cor dos Olhos 👁️</h2>
            <p className="text-muted-foreground text-center">Os olhos são a janela da alma</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {eyeColors.map((eye) => (
                <motion.button
                  key={eye.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEyeColor(eye.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    selectedEyeColor === eye.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full border-4 border-stone-800"
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
            <h2 className="text-2xl font-bold text-center">Acessório ✨</h2>
            <p className="text-muted-foreground text-center">Dê um toque especial!</p>
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
            <h2 className="text-2xl font-bold text-center">Cenário 🌟</h2>
            <p className="text-muted-foreground text-center">Onde seu gatinho estará?</p>
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
            <h2 className="text-2xl font-bold text-center">Expressão 😺</h2>
            <p className="text-muted-foreground text-center">Como seu gatinho está se sentindo?</p>
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

      case "style":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Estilo de Arte 🎨</h2>
            <p className="text-muted-foreground text-center">Como você quer que seu gatinho seja desenhado?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {artStyles.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedStyle === style.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-4xl block mb-2">{style.emoji}</span>
                  <span className="font-semibold block">{style.label}</span>
                  <span className="text-xs text-muted-foreground">{style.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "generate":
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Pronto para criar! 🎉</h2>
            <p className="text-muted-foreground">
              Seu gatinho está configurado. Clique no botão para gerar!
            </p>
            
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="text-6xl mb-4">🐱✨</div>
              <p className="font-medium">
                Raça: {catTypes.find(c => c.id === selectedCatType)?.label}
              </p>
              <p className="text-sm text-muted-foreground">
                Estilo: {artStyles.find(s => s.id === selectedStyle)?.label}
              </p>
            </Card>

            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-gradient text-primary-foreground font-bold text-lg px-8 py-6 rounded-2xl"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Gerar Avatar com IA
                </>
              )}
            </Button>
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
            <Link to="/precos">
              <Button variant="outline" size="sm" className="border-accent text-accent">
                <Crown className="w-4 h-4 mr-2" />
                Premium
              </Button>
            </Link>
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

export default CriarAvatar;
