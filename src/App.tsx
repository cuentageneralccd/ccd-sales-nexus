import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/hooks/useAuth";
import { LoginForm } from "@/components/LoginForm";
import { AuthenticatedApp } from "@/components/AuthenticatedApp";
import NotFound from "./pages/NotFound";
import { dataStore } from '@/services/dataStore';
import React from 'react';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuthContext();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <AuthenticatedApp />;
};

function App() {
  // Initialize sample data on app load
  React.useEffect(() => {
    dataStore.initializeSampleData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
