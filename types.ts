
export interface ShoppingItem {
  name: string;
  quantity: string;
  estimatedPrice: number;
}

export interface PredictionResult {
  estimatedTotal: number;
  currency: string;
  confidence: number;
  categoryAnalysis: string;
  items: ShoppingItem[];
  savingsTips: string[];
  friendlyNote: string;
  budgetStatus: 'under' | 'over' | 'exact';
}

export interface ShoppingFormData {
  budget: number;
  category: string;
  billDetails: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  formData: ShoppingFormData;
  result: PredictionResult;
}

export enum ShoppingCategory {
  GROCERIES = 'Groceries',
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion & Apparel',
  HOME_DECOR = 'Home Decor',
  HEALTH_BEAUTY = 'Health & Beauty',
  STATIONERY = 'Stationery & Office',
  OTHER = 'Other'
}
