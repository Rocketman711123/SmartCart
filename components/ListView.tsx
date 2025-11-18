import React, { useMemo } from 'react';
import type { ShoppingList, ListItem } from '../types';
import { CATEGORIES, CATEGORY_EMOJIS } from '../constants';
import AddItemForm from './AddItemForm';

interface ListViewProps {
  list: ShoppingList;
  isLoading: boolean;
  onAddItem: (itemName: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<ListItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveToPantry: (itemId: string) => Promise<void>;
  onMoveCheckedToPantry: () => void;
  onBack: () => void;
}

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const PantryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zM12 5a1 1 0 11-2 0 1 1 0 012 0zM5 8h10v1H5V8z" />
    </svg>
);

const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);


const ListView: React.FC<ListViewProps> = ({ list, isLoading, onAddItem, onUpdateItem, onDeleteItem, onMoveToPantry, onMoveCheckedToPantry, onBack }) => {
  const groupedItems = useMemo(() => {
    const grouped = list.items.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ListItem[]>);

    return CATEGORIES.filter(cat => grouped[cat]).map(cat => ({
      category: cat,
      items: grouped[cat],
    }));
  }, [list.items]);

  const checkedItemsCount = useMemo(() => list.items.filter(i => i.isChecked).length, [list.items]);

  return (
    <div className="h-full flex flex-col">
      <header className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold truncate">{list.name}</h1>
      </header>

      <div className="flex-grow overflow-y-auto">
        {groupedItems.length > 0 ? (
          groupedItems.map(({ category, items }) => (
            <div key={category} className="p-4">
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <span className="mr-2 text-xl">{CATEGORY_EMOJIS[category]}</span>
                {category}
              </h2>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.id} className={`flex items-center p-2 rounded-md ${item.isChecked ? 'bg-gray-100' : 'bg-white'}`}>
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={(e) => onUpdateItem(item.id, { isChecked: e.target.checked })}
                      className="h-6 w-6 rounded border-gray-300 text-blue-500 focus:ring-blue-500 mr-3"
                      disabled={isLoading}
                    />
                    <span className={`flex-grow ${item.isChecked ? 'line-through text-gray-500' : ''}`}>
                      {item.name}
                    </span>
                    {item.isChecked ? (
                      <button onClick={() => onMoveToPantry(item.id)} className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-100 disabled:opacity-50" disabled={isLoading}>
                        <PantryIcon />
                      </button>
                    ) : (
                      <button onClick={() => onDeleteItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 disabled:opacity-50" disabled={isLoading}>
                        <TrashIcon />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="text-center py-16 px-4">
            <p className="text-gray-500">Your list is empty.</p>
            <p className="text-gray-400 text-sm">Add your first item below.</p>
          </div>
        )}
      </div>

      <div className="sticky bottom-20 bg-white p-4 border-t border-gray-200">
         {checkedItemsCount > 0 && (
          <button
            onClick={onMoveCheckedToPantry}
            disabled={isLoading}
            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-green-300 flex items-center justify-center gap-2 mb-4"
          >
            {isLoading ? <Spinner /> : `Move ${checkedItemsCount} Checked Items to Pantry`}
          </button>
        )}
        <AddItemForm onAddItem={onAddItem} isAdding={isLoading} />
      </div>
    </div>
  );
};

export default ListView;