import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import type { AppData, ListItem, ShoppingList, PantryItem, Category } from '../types';
import { getEstimatedLifespan } from '../services/geminiService';

const initialData: AppData = {
  lists: [],
  pantry: [],
  settings: {
    defaultLifespan: 7, // This is now just a fallback
  },
};

export const useShoppingData = () => {
  const [data, setData] = useLocalStorage<AppData>('smartcart-data', initialData);

  const addList = useCallback((name: string): string => {
    const newList: ShoppingList = {
      id: crypto.randomUUID(),
      name,
      items: [],
      createdAt: new Date().toISOString(),
    };
    setData(prevData => ({ ...prevData, lists: [...prevData.lists, newList] }));
    return newList.id;
  }, [setData]);

  const deleteList = useCallback((listId: string) => {
    setData(prevData => ({ ...prevData, lists: prevData.lists.filter(list => list.id !== listId) }));
  }, [setData]);

  const addItemToList = useCallback((listId: string, itemName: string, category: Category) => {
    const newItem: ListItem = {
      id: crypto.randomUUID(),
      name: itemName,
      category,
      quantity: 1,
      isChecked: false,
      purchaseHistory: [],
    };
    setData(prevData => ({
      ...prevData,
      lists: prevData.lists.map(list =>
        list.id === listId ? { ...list, items: [...list.items, newItem] } : list
      ),
    }));
  }, [setData]);

  const updateItemInList = useCallback((listId: string, itemId: string, updates: Partial<ListItem>) => {
    setData(prevData => ({
      ...prevData,
      lists: prevData.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : list
      ),
    }));
  }, [setData]);
  
  const deleteItemFromList = useCallback((listId: string, itemId: string) => {
    setData(prevData => ({
      ...prevData,
      lists: prevData.lists.map(list => 
        list.id === listId
          ? { ...list, items: list.items.filter(item => item.id !== itemId) }
          : list
      ),
    }));
  }, [setData]);

  const moveItemToPantry = useCallback(async (item: ListItem) => {
    const lifespan = await getEstimatedLifespan(item.name);
    const newPantryItem: PantryItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      purchaseDate: new Date().toISOString(),
      estimatedLifespanDays: lifespan,
    };

    setData(prevData => {
        const newLists = prevData.lists.map(list => ({
            ...list,
            items: list.items.map(i => 
                i.id === item.id 
                    ? { ...i, purchaseHistory: [...(i.purchaseHistory || []), new Date().toISOString()] } 
                    : i
            )
        }));
        
        return {
            ...prevData,
            lists: newLists,
            pantry: [...prevData.pantry.filter(p => p.id !== item.id), newPantryItem]
        };
    });
  }, [setData]);

  const moveCheckedToPantry = useCallback(async (listId: string) => {
    const list = data.lists.find(l => l.id === listId);
    if (!list) return;

    const itemsToMove = list.items.filter(item => item.isChecked);
    if (itemsToMove.length === 0) return;

    const lifespans = await Promise.all(
      itemsToMove.map(item => getEstimatedLifespan(item.name))
    );

    const newPantryItems: PantryItem[] = itemsToMove.map((item, index) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      purchaseDate: new Date().toISOString(),
      estimatedLifespanDays: lifespans[index],
    }));

    const itemIdsToMove = new Set(itemsToMove.map(item => item.id));

    setData(prevData => {
      const newLists = prevData.lists.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            items: l.items.map(item =>
              itemIdsToMove.has(item.id)
                ? { ...item, purchaseHistory: [...(item.purchaseHistory || []), new Date().toISOString()] }
                : item
            )
          };
        }
        return l;
      });

      const pantryItemIds = new Set(newPantryItems.map(p => p.id));
      const updatedPantry = [
        ...prevData.pantry.filter(p => !pantryItemIds.has(p.id)),
        ...newPantryItems
      ];
      
      return {
        ...prevData,
        lists: newLists,
        pantry: updatedPantry
      };
    });
  }, [data.lists, setData]);

  const deleteItemFromPantry = useCallback((itemId: string) => {
    setData(prevData => ({
      ...prevData,
      pantry: prevData.pantry.filter(item => item.id !== itemId)
    }));
  }, [setData]);

  const getPredictedItems = useCallback((): string[] => {
    const allItems: { [name: string]: { history: Date[], lastPurchase?: PantryItem } } = {};
    
    data.lists.forEach(list => {
      list.items.forEach(item => {
        if (!allItems[item.name]) {
            allItems[item.name] = { history: [], lastPurchase: undefined };
        }
        if (item.purchaseHistory) {
            allItems[item.name].history.push(...item.purchaseHistory.map(d => new Date(d)));
        }
      });
    });

    data.pantry.forEach(pantryItem => {
        if (allItems[pantryItem.name]) {
            allItems[pantryItem.name].lastPurchase = pantryItem;
        }
    });

    const predictions: string[] = [];
    Object.entries(allItems).forEach(([name, data]) => {
      if (data.history.length > 1) {
        const sortedHistory = data.history.sort((a, b) => a.getTime() - b.getTime());
        let totalDiff = 0;
        for (let i = 1; i < sortedHistory.length; i++) {
          totalDiff += sortedHistory[i].getTime() - sortedHistory[i-1].getTime();
        }
        const avgInterval = totalDiff / (sortedHistory.length - 1); // in ms
        const lastPurchaseTime = sortedHistory[sortedHistory.length - 1].getTime();
        const nextPurchaseTime = lastPurchaseTime + avgInterval;
        
        if (Date.now() > nextPurchaseTime && !data.lastPurchase) {
          predictions.push(name);
        }
      }
    });

    return Array.from(new Set(predictions)).slice(0, 5); // Return unique, max 5 predictions
  }, [data.lists, data.pantry]);

  return { data, addList, deleteList, addItemToList, updateItemInList, deleteItemFromList, moveItemToPantry, deleteItemFromPantry, getPredictedItems, moveCheckedToPantry };
};