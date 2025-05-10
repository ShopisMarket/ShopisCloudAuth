export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ShoppingItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  isPurchased: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingList {
  _id: string;
  name: string;
  items: ShoppingItem[];
  owner: string;
  sharedWith: string[];
  totalBudget: number;
  createdAt: string;
  updatedAt: string;
}