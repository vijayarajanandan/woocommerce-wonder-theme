// Matomo Ecommerce + Event Tracking for Scentora

declare global {
  interface Window {
    _mtm: any[];
    _paq: any[];
  }
}

const getPaq = () => {
  window._paq = window._paq || [];
  return window._paq;
};

// ============ ECOMMERCE TRACKING ============

// Track cart update (call after any cart change)
export const trackCartUpdate = (
  items: Array<{
    id: number;
    name: string;
    category?: string;
    price: number;
    quantity: number;
  }>,
  cartTotal: number
) => {
  const _paq = getPaq();
  
  // Add all items
  items.forEach((item) => {
    _paq.push([
      'addEcommerceItem',
      item.id.toString(),
      item.name,
      item.category || 'Candles',
      item.price,
      item.quantity,
    ]);
  });
  
  // Track cart total
  _paq.push(['trackEcommerceCartUpdate', cartTotal]);
};

// Track completed order
export const trackOrder = (order: {
  orderId: string;
  total: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  items: Array<{
    id: number;
    name: string;
    category?: string;
    price: number;
    quantity: number;
  }>;
}) => {
  const _paq = getPaq();
  
  // Add all items first
  order.items.forEach((item) => {
    _paq.push([
      'addEcommerceItem',
      item.id.toString(),
      item.name,
      item.category || 'Candles',
      item.price,
      item.quantity,
    ]);
  });
  
  // Track the order
  _paq.push([
    'trackEcommerceOrder',
    order.orderId,
    order.total,
    order.subtotal || order.total,
    order.tax || 0,
    order.shipping || 0,
  ]);
};

// Track product view
export const trackProductView = (product: {
  id: number;
  name: string;
  category?: string;
  price: number;
}) => {
  const _paq = getPaq();
  _paq.push([
    'setEcommerceView',
    product.id.toString(),
    product.name,
    product.category || 'Candles',
    product.price,
  ]);
  _paq.push(['trackPageView']);
};

// ============ EVENT TRACKING ============

// Generic event tracking
export const trackEvent = (
  category: string,
  action: string,
  name?: string,
  value?: number
) => {
  const _paq = getPaq();
  _paq.push(['trackEvent', category, action, name, value]);
};

// Track wishlist actions
export const trackWishlistAdd = (product: { id: number; name: string; price: number }) => {
  trackEvent('Wishlist', 'Add', product.name, product.price);
};

export const trackWishlistRemove = (product: { id: number; name: string }) => {
  trackEvent('Wishlist', 'Remove', product.name);
};

// Track promo code
export const trackPromoCode = (code: string, discountPercent: number, cartTotal: number) => {
  const discountValue = Math.round(cartTotal * (discountPercent / 100));
  trackEvent('Promo', 'Applied', code, discountValue);
};

// Track site search
export const trackSiteSearch = (keyword: string, category?: string, resultsCount?: number) => {
  const _paq = getPaq();
  _paq.push(['trackSiteSearch', keyword, category || false, resultsCount || 0]);
};

// Track filter usage
export const trackFilterUsage = (filterType: string, filterValue: string) => {
  trackEvent('Filter', filterType, filterValue);
};

// Track payment method selection
export const trackPaymentMethodSelected = (method: string) => {
  trackEvent('Checkout', 'Payment Method', method);
};