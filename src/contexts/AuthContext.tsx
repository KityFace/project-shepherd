import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface SubscriptionInfo {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  generationsCount: number;
  generationsLimit: number | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  subscription: SubscriptionInfo | null;
  isSubscriptionLoading: boolean;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  canGenerate: boolean;
  remainingGenerations: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);

  const refreshSubscription = async () => {
    if (!session) {
      setSubscription(null);
      return;
    }

    setIsSubscriptionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        return;
      }

      if (data) {
        setSubscription({
          subscribed: data.subscribed,
          productId: data.product_id,
          subscriptionEnd: data.subscription_end,
          generationsCount: data.generations_count ?? 0,
          generationsLimit: data.generations_limit,
        });
      }
    } catch (err) {
      console.error("Failed to check subscription:", err);
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // INITIAL load - controls isLoading
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error during initial auth setup:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // Set up auth state listener for ONGOING changes (does NOT control isLoading)
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Run initial auth check
    initializeAuth();

    return () => {
      isMounted = false;
      authSubscription.unsubscribe();
    };
  }, []);

  // Check subscription when session changes
  useEffect(() => {
    if (session) {
      refreshSubscription();
    } else {
      setSubscription(null);
    }
  }, [session]);

  // Auto-refresh subscription every minute
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      refreshSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [session]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setSubscription(null);
  };

  const canGenerate = subscription
    ? subscription.subscribed || subscription.generationsCount < (subscription.generationsLimit ?? 3)
    : true;

  const remainingGenerations = subscription
    ? subscription.subscribed 
      ? null // Unlimited
      : Math.max(0, (subscription.generationsLimit ?? 3) - subscription.generationsCount)
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        subscription,
        isSubscriptionLoading,
        signOut,
        refreshSubscription,
        canGenerate,
        remainingGenerations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
