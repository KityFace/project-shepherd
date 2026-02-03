import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Video, Clock, X, Loader2, Cat } from "lucide-react";
import { toast } from "sonner";

const AssinarPremium = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    // TODO: Integrate with Stripe when Cloud is enabled
    try {
      toast.info("Funcionalidade de pagamento será ativada com o Lovable Cloud!");
      setTimeout(() => {
        setLoading(false);
        navigate("/cadastro");
      }, 1500);
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Erro ao criar sessão de pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  const freePlanFeatures = [
    { text: "3 vídeos por mês", included: true },
    { text: "Vídeos de 5 segundos", included: true },
    { text: "Com marca d'água", included: true },
    { text: "Vídeos ilimitados", included: false },
    { text: "Vídeos de 2 minutos", included: false },
    { text: "Sem marca d'água", included: false },
  ];

  const premiumPlanFeatures = [
    { text: "Vídeos ilimitados", included: true },
    { text: "Vídeos de até 2 minutos", included: true },
    { text: "Sem marca d'água", included: true },
    { text: "Suporte prioritário", included: true },
    { text: "Acesso a novos recursos", included: true },
    { text: "Qualidade HD", included: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-primary flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Cat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading">Gat.AI</span>
          </Link>
          <Button variant="outline" onClick={() => navigate("/")}>
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Crown className="h-3 w-3 mr-1" />
            Plano Premium
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Desbloqueie Todo o Potencial
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crie vídeos incríveis de gatinhos sem limites.
            Assine o Premium e transforme suas ideias em realidade.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border-2 border-muted">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Gratuito</CardTitle>
              <CardDescription>Para começar a explorar</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground/50"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full mt-6"
                onClick={() => navigate("/cadastro")}
              >
                Criar Conta Grátis
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-primary shadow-lg shadow-primary/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Mais Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                Premium
              </CardTitle>
              <CardDescription>Para criadores sérios</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 9,80</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {premiumPlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent-foreground flex-shrink-0" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Assinar Premium
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Cancele quando quiser. Sem compromisso.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Por que escolher o Premium?</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 rounded-xl bg-card border">
              <Video className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Vídeos Ilimitados</h3>
              <p className="text-sm text-muted-foreground">
                Crie quantos vídeos quiser, sem restrições
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border">
              <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Até 2 Minutos</h3>
              <p className="text-sm text-muted-foreground">
                Vídeos mais longos para contar histórias completas
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border">
              <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Sem Marca D'água</h3>
              <p className="text-sm text-muted-foreground">
                Vídeos limpos e profissionais para compartilhar
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Gat.AI - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default AssinarPremium;
