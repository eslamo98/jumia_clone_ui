export interface CartItem {
  cartItemId: number;
  cartId: number;
  productId: number;
  name: string;
  productName: string;
  imageUrl: string;
  productImage: string;
  priceAtAddition: number;
  originalPrice: number;
  discountedPrice: number;
  percentOff: number;
  quantity: number;
  maxQuantity: number;
  totalPrice: number;
  variantId?: number;
  variantName?: string;
  isJumiaExpress?: boolean;
  attributes?: { [key: string]: string };
}
