// Matomo Ecommerce Tracking for Scentora

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