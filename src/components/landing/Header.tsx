import { Button } from "@/components/ui/button";
import { Cat, Crown, LogOut, User, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export const Header = () => {
  const { user, subscription, signOut, isLoading } = useAuth();
  const isPremium = subscription?.subscribed ?? false;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-soft">
            <Cat className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-heading font-bold text-gradient">
            Gat.AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Como Funciona
          </a>
          <a href="#precos" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Preços
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <>
              {/* Premium Badge - Elaborado */}
              {isPremium && (
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="relative"
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white shadow-lg">
                    <motion.div
                      animate={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <Trophy className="w-4 h-4" />
                    </motion.div>
                    <span className="font-bold text-sm">Premium</span>
                    <motion.div
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity 
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                    </motion.div>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 blur-md opacity-40 -z-10" />
                </motion.div>
              )}
              
              {/* User info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {user.email}
                </span>
              </div>

              {/* Sign out */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signOut}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="font-semibold">
                  Entrar
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button className="btn-gradient font-semibold text-primary-foreground border-0">
                  Começar Grátis
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
