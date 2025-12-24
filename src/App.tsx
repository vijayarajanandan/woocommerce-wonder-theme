import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { CartSidebar } from "@/components/cart/CartSidebar";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import CandleDetail from "./pages/CandleDetail";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import FAQ from "./pages/FAQ";
import OrderConfirmation from "./pages/OrderConfirmation";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WishlistProvider>
        <RecentlyViewedProvider>
          <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CartSidebar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:slug" element={<CandleDetail />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/account" element={<Account />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </CartProvider>
        </RecentlyViewedProvider>
      </WishlistProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
