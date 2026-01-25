import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import GuideDetail from "@/pages/GuideDetail";
import CategoryPage from "@/pages/CategoryPage";
import SearchResults from "@/pages/SearchResults";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

// ✅ Add these imports (make sure these files exist)
import Npcs from "@/pages/Npcs";
import NpcDetail from "@/pages/NpcDetail";
import Items from "@/pages/Items";
import ItemDetail from "@/pages/ItemDetail";

// Inline ScrollToTop since it wasn't explicitly asked for but is good UX
function ScrollToTopWrapper() {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRouter() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTopWrapper />
      <Navigation />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={SearchResults} />
          <Route path="/guides/:slug" component={GuideDetail} />

          {/* ✅ EOR API routes MUST be before /:category */}
          <Route path="/npcs" component={Npcs} />
          <Route path="/npcs/:id" component={NpcDetail} />
          <Route path="/items" component={Items} />
          <Route path="/items/:id" component={ItemDetail} />

          {/* Category routes (posts) */}
          <Route path="/:category" component={CategoryPage} />

          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <WouterRouter hook={useHashLocation}>
          <AppRouter />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
