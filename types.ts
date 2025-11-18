
export enum Category {
  PRODUCE = 'Produce',
  DAIRY_EGGS = 'Dairy & Eggs',
  MEAT_SEAFOOD = 'Meat & Seafood',
  BAKERY_BREAD = 'Bakery & Bread',
  PANTRY = 'Pantry',
  FROZEN_FOODS = 'Frozen Foods',
  SNACKS = 'Snacks',
  BEVERAGES = 'Beverages',
  HOUSEHOLD = 'Household',
  PERSONAL_CARE = 'Personal Care',
  OTHER = 'Other',
}

export interface ListItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  isChecked: boolean;
  purchaseHistory: string[]; // ISO date strings
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ListItem[];
  createdAt: string; // ISO date string
}

export interface PantryItem {
  id: string;
  name: string;
  category: Category;
  purchaseDate: string; // ISO date string
  estimatedLifespanDays: number;
}

export interface AppData {
  lists: ShoppingList[];
  pantry: PantryItem[];
  settings: {
    defaultLifespan: number;
  };
}
