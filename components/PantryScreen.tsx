
import React, { useMemo } from 'react';
import type { PantryItem } from '../types';
import { CATEGORIES, CATEGORY_EMOJIS } from '../constants';

interface PantryScreenProps {
  pantryItems: PantryItem[];
  onDeleteItem: (itemId: string) => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const PantryScreen: React.FC<PantryScreenProps> = ({ pantryItems, onDeleteItem }) => {
  const groupedItems = useMemo(() => {
    const grouped = pantryItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, PantryItem[]>);

    return CATEGORIES.filter(cat => grouped[cat]).map(cat => ({
      category: cat,
      items: grouped[cat],
    }));
  }, [pantryItems]);

  const getDaysRemaining = (item: PantryItem): number => {
    const purchaseDate = new Date(item.purchaseDate);
    const expiryDate = new Date(purchaseDate.setDate(purchaseDate.getDate() + item.estimatedLifespanDays));
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const getStatusColor = (days: number) => {
    if (days <= 1) return 'bg-red-500';
    if (days <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-4 space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">My Pantry</h1>
        <p className="text-gray-500">What you have at home</p>
      </header>
      
      {groupedItems.length > 0 ? (
        groupedItems.map(({ category, items }) => (
          <div key={category}>
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <span className="mr-2 text-xl">{CATEGORY_EMOJIS[category]}</span>
              {category}
            </h2>
            <ul className="space-y-2">
              {items.map(item => {
                const daysRemaining = getDaysRemaining(item);
                return (
                  <li key={item.id} className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex-grow">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full ${getStatusColor(daysRemaining)}`}></div>
                       <button onClick={() => onDeleteItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100">
                         <TrashIcon />
                       </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      ) : (
        <div className="text-center py-20 px-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Your pantry is empty.</p>
          <p className="text-gray-400 text-sm">When you check off an item from a list, you can add it here.</p>
        </div>
      )}
    </div>
  );
};

export default PantryScreen;
