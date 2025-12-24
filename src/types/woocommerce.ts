// WooCommerce API Response Types
// These types match the WooCommerce REST API v3 response structure

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: 'simple' | 'grouped' | 'external' | 'variable';
  status: 'draft' | 'pending' | 'private' | 'publish';
  featured: boolean;
  catalog_visibility: 'visible' | 'catalog' | 'search' | 'hidden';
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  external_url: string;
  button_text: string;
  tax_status: 'taxable' | 'shipping' | 'none';
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  backorders: 'no' | 'notify' | 'yes';
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: WCCategory[];
  tags: WCTag[];
  images: WCImage[];
  attributes: WCAttribute[];
  default_attributes: WCDefaultAttribute[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: WCMetaData[];
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WCTag {
  id: number;
  name: string;
  slug: string;
}

export interface WCImage {
  id: number;
  date_created: string;
  date_modified: string;
  src: string;
  name: string;
  alt: string;
}

export interface WCAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface WCDefaultAttribute {
  id: number;
  name: string;
  option: string;
}

export interface WCMetaData {
  id: number;
  key: string;
  value: string | object;
}

// WooCommerce Category (full response)
export interface WCProductCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: 'default' | 'products' | 'subcategories' | 'both';
  image: WCImage | null;
  menu_order: number;
  count: number;
}

// Cart Types (for CoCart or WC Store API)
export interface WCCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description: string;
  sku: string;
  price: string;
  line_price: string;
  line_subtotal: string;
  line_total: string;
  featured_image: string;
  variations: Record<string, string>;
}

export interface WCCart {
  cart_key: string;
  items: WCCartItem[];
  item_count: number;
  items_weight: number;
  coupons: WCCoupon[];
  needs_payment: boolean;
  needs_shipping: boolean;
  shipping: WCShipping;
  totals: WCCartTotals;
}

export interface WCCoupon {
  code: string;
  discount: string;
  discount_type: string;
}

export interface WCShipping {
  total: string;
  packages: WCShippingPackage[];
}

export interface WCShippingPackage {
  package_id: number;
  package_name: string;
  chosen_method: string;
  rates: WCShippingRate[];
}

export interface WCShippingRate {
  rate_id: string;
  name: string;
  description: string;
  cost: string;
  instance_id: number;
  method_id: string;
}

export interface WCCartTotals {
  subtotal: string;
  subtotal_tax: string;
  shipping_total: string;
  shipping_tax: string;
  discount_total: string;
  discount_tax: string;
  cart_contents_total: string;
  cart_contents_tax: string;
  fee_total: string;
  fee_tax: string;
  total: string;
  total_tax: string;
}

// Order Types
export interface WCOrder {
  id: number;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  version: string;
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed' | 'trash';
  currency: string;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  prices_include_tax: boolean;
  customer_id: number;
  customer_ip_address: string;
  customer_user_agent: string;
  customer_note: string;
  billing: WCAddress;
  shipping: WCAddress;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  date_paid: string | null;
  date_completed: string | null;
  cart_hash: string;
  meta_data: WCMetaData[];
  line_items: WCLineItem[];
  tax_lines: WCTaxLine[];
  shipping_lines: WCShippingLine[];
  fee_lines: WCFeeLine[];
  coupon_lines: WCCouponLine[];
  refunds: WCRefund[];
  set_paid: boolean;
}

export interface WCAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface WCLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: WCTax[];
  meta_data: WCMetaData[];
  sku: string;
  price: number;
}

export interface WCTax {
  id: number;
  total: string;
  subtotal: string;
}

export interface WCTaxLine {
  id: number;
  rate_code: string;
  rate_id: number;
  label: string;
  compound: boolean;
  tax_total: string;
  shipping_tax_total: string;
  meta_data: WCMetaData[];
}

export interface WCShippingLine {
  id: number;
  method_title: string;
  method_id: string;
  total: string;
  total_tax: string;
  taxes: WCTax[];
  meta_data: WCMetaData[];
}

export interface WCFeeLine {
  id: number;
  name: string;
  tax_class: string;
  tax_status: string;
  total: string;
  total_tax: string;
  taxes: WCTax[];
  meta_data: WCMetaData[];
}

export interface WCCouponLine {
  id: number;
  code: string;
  discount: string;
  discount_tax: string;
  meta_data: WCMetaData[];
}

export interface WCRefund {
  id: number;
  reason: string;
  total: string;
}

// Customer Types
export interface WCCustomer {
  id: number;
  date_created: string;
  date_modified: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: WCAddress;
  shipping: WCAddress;
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: WCMetaData[];
}

// Review Types
export interface WCReview {
  id: number;
  date_created: string;
  product_id: number;
  status: 'approved' | 'hold' | 'spam' | 'trash';
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
}

// API Response wrapper
export interface WCApiResponse<T> {
  data: T;
  headers: {
    'x-wp-total'?: string;
    'x-wp-totalpages'?: string;
  };
}

// Query parameters
export interface WCProductsQuery {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'price' | 'popularity' | 'rating';
  parent?: number[];
  parent_exclude?: number[];
  slug?: string;
  status?: 'any' | 'draft' | 'pending' | 'private' | 'publish';
  type?: 'simple' | 'grouped' | 'external' | 'variable';
  sku?: string;
  featured?: boolean;
  category?: string;
  tag?: string;
  shipping_class?: string;
  attribute?: string;
  attribute_term?: string;
  tax_class?: string;
  on_sale?: boolean;
  min_price?: string;
  max_price?: string;
  stock_status?: 'instock' | 'outofstock' | 'onbackorder';
}

export interface WCOrdersQuery {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug';
  parent?: number[];
  parent_exclude?: number[];
  status?: string;
  customer?: number;
  product?: number;
  dp?: number;
}
