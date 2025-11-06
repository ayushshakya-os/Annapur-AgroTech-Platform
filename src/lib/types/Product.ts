export interface Product {
  _id: number;
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
