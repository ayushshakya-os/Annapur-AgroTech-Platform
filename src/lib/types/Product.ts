export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  short_description: string;
  description?: string;
  quantity?: number;
  farmerId?: number;
  farmerName?: string;
}
