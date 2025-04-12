import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { storeUserToFirestore } from "./hooks/useStoreUser"; // Make sure to update the path if necessary

const queryClient = new QueryClient();

const App = () => {
  const { user } = useUser();

  // Effect to store user data in Firestore on successful sign-up or sign-in
  useEffect(() => {
    if (user) {
      storeUserToFirestore({ 
        email: user.primaryEmailAddress?.emailAddress || '', 
        id: user.id 
      });
    }
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toasters for UI notifications */}
        <Toaster />
        <Sonner />

        {/* Authentication UI */}
        <header
          style={{
            marginLeft: '20px',
            marginTop: '20px',
            width: 'max-content',
            backgroundColor: '#F75A5A',
            padding: '10px 15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // subtle shadow
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>

        {/* Application Routes */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Add your custom routes above the catch-all "*" route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
