import React, { useState } from 'react';
import type { ShoppingList } from '../types';

interface HomeScreenProps {
  lists: ShoppingList[];
  onSelectList: (listId: string) => void;
  onAddList: (name: string) => string;
  onDeleteList: (listId: string) => void;
  predictedItems: string[];
  onAddItem: (itemName: string) => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ lists, onSelectList, onAddList, onDeleteList, predictedItems, onAddItem }) => {
  const [newListName, setNewListName] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onAddList(newListName.trim());
      setNewListName('');
      setIsAddingList(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">SmartCart</h1>
        <p className="text-gray-500">Your intelligent shopping companion</p>
      </header>

      {predictedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Running Low?</h2>
          <div className="flex flex-wrap gap-2">
            {predictedItems.map(item => (
              <button
                key={item}
                onClick={() => onAddItem(item)}
                className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-300 hover:bg-blue-100 transition-colors"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">My Lists</h2>
          <button onClick={() => setIsAddingList(true)} className="p-2 rounded-full hover:bg-gray-100">
            <PlusIcon />
          </button>
        </div>
        {isAddingList && (
          <form onSubmit={handleAddList} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="New list name..."
              className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900 placeholder-gray-500"
              autoFocus
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add</button>
          </form>
        )}
        <div className="space-y-3">
          {lists.map(list => (
            <div key={list.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between transition-shadow hover:shadow-md">
              <div onClick={() => onSelectList(list.id)} className="cursor-pointer flex-grow">
                <h3 className="font-semibold text-lg">{list.name}</h3>
                <p className="text-sm text-gray-500">{list.items.filter(i => !i.isChecked).length} items left</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to delete "${list.name}"?`)) {
                    onDeleteList(list.id);
                  }
                }}
                className="text-gray-400 hover:text-red-500 p-2 rounded-full"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
          {lists.length === 0 && !isAddingList && (
             <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">You have no lists yet.</p>
                <button onClick={() => setIsAddingList(true)} className="mt-2 text-blue-500 font-semibold">Create your first list</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;