export interface Product {
        id: number;
        name: string;
        price: number;
        oldPrice?: number;
        discount?: number;
        image: string;
        category: string;
        rating: number;
        inStock: boolean;
        freeShipping?: boolean;
        description?: string;
      }

