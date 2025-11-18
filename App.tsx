import React, { useState, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import ListView from './components/ListView';
import PantryScreen from './components/PantryScreen';
import SettingsScreen from './components/SettingsScreen';
import BottomNavBar from './components/BottomNavBar';
import { useShoppingData } from './hooks/useShoppingData';
import type { ListItem } from './types';
import { categorizeItem } from './services/geminiService';
import { Category } from './types';

export type Screen = 'home' | 'list' | 'pantry' | 'settings';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    addList,
    deleteList,
    addItemToList,
    updateItemInList,
    deleteItemFromList,
    moveItemToPantry,
    moveCheckedToPantry,
    deleteItemFromPantry,
    getPredictedItems,
  } = useShoppingData();

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleSelectList = (listId: string) => {
    setActiveListId(listId);
    setCurrentScreen('list');
  };

  const handleAddItem = useCallback(async (listId: string, itemName: string) => {
    if (!itemName.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const category = await categorizeItem(itemName) as Category;
      addItemToList(listId, itemName, category);
    } catch (error) {
      console.error("Failed to categorize item:", error);
      addItemToList(listId, itemName, Category.OTHER);
    } finally {
      setIsLoading(false);
    }
  }, [addItemToList, isLoading]);

  const handleMoveItemToPantry = useCallback(async (item: ListItem) => {
    setIsLoading(true);
    try {
      await moveItemToPantry(item);
    } catch (error) {
      console.error("Failed to move item to pantry:", error);
    } finally {
      setIsLoading(false);
    }
  }, [moveItemToPantry]);

  const handleMoveCheckedToPantry = useCallback(async (listId: string) => {
    setIsLoading(true);
    try {
      await moveCheckedToPantry(listId);
    } catch (error) {
      console.error("Failed to move checked items to pantry:", error);
    } finally {
      setIsLoading(false);
    }
  }, [moveCheckedToPantry]);


  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            lists={data.lists}
            onSelectList={handleSelectList}
            onAddList={addList}
            onDeleteList={deleteList}
            predictedItems={getPredictedItems()}
            onAddItem={(itemName) => {
              let listId = data.lists[0]?.id;
              if (!listId) {
                listId = addList("My Shopping List");
              }
              handleAddItem(listId, itemName);
            }}
          />
        );
      case 'list':
        const activeList = data.lists.find(l => l.id === activeListId);
        if (activeList) {
          return (
            <ListView
              list={activeList}
              isLoading={isLoading}
              onAddItem={(itemName) => handleAddItem(activeList.id, itemName)}
              onUpdateItem={(itemId, updates) => updateItemInList(activeList.id, itemId, updates)}
              onDeleteItem={(itemId) => deleteItemFromList(activeList.id, itemId)}
              onMoveToPantry={async (itemId) => {
                const item = activeList.items.find(i => i.id === itemId);
                if(item) await handleMoveItemToPantry(item);
              }}
              onMoveCheckedToPantry={() => handleMoveCheckedToPantry(activeList.id)}
              onBack={() => setCurrentScreen('home')}
            />
          );
        }
        setCurrentScreen('home'); // Fallback if list not found
        return null;
      case 'pantry':
        return <PantryScreen pantryItems={data.pantry} onDeleteItem={deleteItemFromPantry} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen lists={data.lists} onSelectList={handleSelectList} onAddList={addList} onDeleteList={deleteList} predictedItems={getPredictedItems()} onAddItem={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-lg h-screen flex flex-col">
        <main className="flex-1 overflow-y-auto pb-20">
          {renderScreen()}
        </main>
        <BottomNavBar currentScreen={currentScreen} onNavigate={handleNavigate} />
      </div>
    </div>
  );
};

export default App;
