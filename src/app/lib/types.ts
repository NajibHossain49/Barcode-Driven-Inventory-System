// This file defines TypeScript interfaces for the application.
export interface Product {
  _id?: string;
  barcode: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface Category {
  _id?: string;
  name: string;
}
