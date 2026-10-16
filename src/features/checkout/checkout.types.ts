export type ReceiveType = 'pickup' | 'delivery';
export interface CheckoutData {
  fullName: string;
  phone: string;
  productService: string;
  quantity: number;
  customizationType: string;
  theme: string;
  personalizedName: string;
  age: string;
  desiredDate: string;
  receiveType: ReceiveType;
  address: string;
  notes: string;
}
