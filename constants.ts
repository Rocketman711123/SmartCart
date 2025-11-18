
import { Category } from './types';

export const CATEGORIES: Category[] = [
  Category.PRODUCE,
  Category.MEAT_SEAFOOD,
  Category.DAIRY_EGGS,
  Category.BAKERY_BREAD,
  Category.PANTRY,
  Category.FROZEN_FOODS,
  Category.SNACKS,
  Category.BEVERAGES,
  Category.HOUSEHOLD,
  Category.PERSONAL_CARE,
  Category.OTHER,
];

export const CATEGORY_EMOJIS: { [key in Category]: string } = {
  [Category.PRODUCE]: '🍎',
  [Category.DAIRY_EGGS]: '🥚',
  [Category.MEAT_SEAFOOD]: '🥩',
  [Category.BAKERY_BREAD]: '🥖',
  [Category.PANTRY]: '🥫',
  [Category.FROZEN_FOODS]: '🧊',
  [Category.SNACKS]: '🍿',
  [Category.BEVERAGES]: '🥤',
  [Category.HOUSEHOLD]: '🧼',
  [Category.PERSONAL_CARE]: '🧴',
  [Category.OTHER]: '🛒',
};
