import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';
import { ShoppingList, ShoppingItem } from '../types';

interface ShoppingListState {
  lists: ShoppingList[];
  currentList: ShoppingList | null;
  isLoading: boolean;
  error: string | null;
}

type ShoppingListAction =
  | { type: 'GET_LISTS_SUCCESS'; payload: ShoppingList[] }
  | { type: 'GET_LIST_SUCCESS'; payload: ShoppingList }
  | { type: 'ADD_LIST_SUCCESS'; payload: ShoppingList }
  | { type: 'UPDATE_LIST_SUCCESS'; payload: ShoppingList }
  | { type: 'DELETE_LIST_SUCCESS'; payload: string }
  | { type: 'ADD_ITEM_SUCCESS'; payload: { listId: string; item: ShoppingItem } }
  | { type: 'UPDATE_ITEM_SUCCESS'; payload: { listId: string; item: ShoppingItem } }
  | { type: 'DELETE_ITEM_SUCCESS'; payload: { listId: string; itemId: string } }
  | { type: 'SHOPPING_LIST_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' };

const initialState: ShoppingListState = {
  lists: [],
  currentList: null,
  isLoading: true,
  error: null,
};

const ShoppingListContext = createContext<{
  state: ShoppingListState;
  getLists: () => Promise<void>;
  getList: (id: string) => Promise<void>;
  addList: (list: Omit<ShoppingList, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateList: (id: string, list: Partial<ShoppingList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  addItem: (listId: string, item: Omit<ShoppingItem, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (listId: string, itemId: string, item: Partial<ShoppingItem>) => Promise<void>;
  deleteItem: (listId: string, itemId: string) => Promise<void>;
  shareList: (listId: string, email: string) => Promise<void>;
}>({
  state: initialState,
  getLists: async () => {},
  getList: async () => {},
  addList: async () => {},
  updateList: async () => {},
  deleteList: async () => {},
  addItem: async () => {},
  updateItem: async () => {},
  deleteItem: async () => {},
  shareList: async () => {},
});

const shoppingListReducer = (state: ShoppingListState, action: ShoppingListAction): ShoppingListState => {
  switch (action.type) {
    case 'GET_LISTS_SUCCESS':
      return {
        ...state,
        lists: action.payload,
        isLoading: false,
      };
    case 'GET_LIST_SUCCESS':
      return {
        ...state,
        currentList: action.payload,
        isLoading: false,
      };
    case 'ADD_LIST_SUCCESS':
      return {
        ...state,
        lists: [...state.lists, action.payload],
        isLoading: false,
      };
    case 'UPDATE_LIST_SUCCESS':
      return {
        ...state,
        lists: state.lists.map((list) =>
          list._id === action.payload._id ? action.payload : list
        ),
        currentList: state.currentList?._id === action.payload._id ? action.payload : state.currentList,
        isLoading: false,
      };
    case 'DELETE_LIST_SUCCESS':
      return {
        ...state,
        lists: state.lists.filter((list) => list._id !== action.payload),
        currentList: state.currentList?._id === action.payload ? null : state.currentList,
        isLoading: false,
      };
    case 'ADD_ITEM_SUCCESS': {
      const { listId, item } = action.payload;
      const updatedLists = state.lists.map((list) => {
        if (list._id === listId) {
          return {
            ...list,
            items: [...list.items, item],
          };
        }
        return list;
      });
      
      const updatedCurrentList = state.currentList?._id === listId
        ? { ...state.currentList, items: [...state.currentList.items, item] }
        : state.currentList;
      
      return {
        ...state,
        lists: updatedLists,
        currentList: updatedCurrentList,
        isLoading: false,
      };
    }
    case 'UPDATE_ITEM_SUCCESS': {
      const { listId, item } = action.payload;
      const updatedLists = state.lists.map((list) => {
        if (list._id === listId) {
          return {
            ...list,
            items: list.items.map((i) => (i._id === item._id ? item : i)),
          };
        }
        return list;
      });
      
      const updatedCurrentList = state.currentList?._id === listId
        ? {
            ...state.currentList,
            items: state.currentList.items.map((i) => (i._id === item._id ? item : i)),
          }
        : state.currentList;
      
      return {
        ...state,
        lists: updatedLists,
        currentList: updatedCurrentList,
        isLoading: false,
      };
    }
    case 'DELETE_ITEM_SUCCESS': {
      const { listId, itemId } = action.payload;
      const updatedLists = state.lists.map((list) => {
        if (list._id === listId) {
          return {
            ...list,
            items: list.items.filter((item) => item._id !== itemId),
          };
        }
        return list;
      });
      
      const updatedCurrentList = state.currentList?._id === listId
        ? {
            ...state.currentList,
            items: state.currentList.items.filter((item) => item._id !== itemId),
          }
        : state.currentList;
      
      return {
        ...state,
        lists: updatedLists,
        currentList: updatedCurrentList,
        isLoading: false,
      };
    }
    case 'SHOPPING_LIST_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(shoppingListReducer, initialState);

  // Get all lists
  const getLists = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lists`);
      dispatch({ type: 'GET_LISTS_SUCCESS', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'SHOPPING_LIST_ERROR',
        payload: err.response?.data?.msg || 'Error fetching lists',
      });
    }
  };

  // Get single list
  const getList = async (id: string) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lists/${id}`);
      dispatch({ type: 'GET_LIST_SUCCESS', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'SHOPPING_LIST_ERROR',
        payload: err.response?.data?.msg || 'Error fetching list',
      });
    }
  };

  // Add new list
  const addList = async (list: Omit<ShoppingList, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/lists`, list);
      dispatch({ type: 'ADD_LIST_SUCCESS', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'SHOPPING_LIST_ERROR',
        payload: err.response?.data?.msg || 'Error adding list',
      });
    }
  };

  // Update list
  const updateList = async (id: string, list: Partial<ShoppingList>) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/lists/${id}`, list);
      dispatch({ type: 'UPDATE_LIST_SUCCESS', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'SHOPPING_LIST_ERROR',
        payload: err.response?.data?.msg || 'Error updating list',
      });
    }
  };

  // Delete list
  const deleteList = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/lists/${id}`);
      dispatch({ type: 'DELETE_LIST_SUCCESS', payload: id });
    } catch (err: any) {
      dispatch({
        type: 'SHOPPING_LIST_ERROR',
        payload: err.response?.data?.msg || 'Error deleting list',
      });
    }
  };

  // Add item to list
  const addItem = async (listId: string, item: Omit<ShoppingItem, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/lists/${listId}/items`, item);
      dispatch({
        type: 'ADD_ITEM_SUCCESS',
        payload: { listId, item: res.data },
      });
    } catch (err: any) {
      dispatch({
        type: 'SHOPPING_LIST_ERROR',
        payload: err.response?.data?.msg || 'Error adding item',
      });
    }
  };

  // Update item
  const updateItem = async (listId: string, itemId: string, item: Partial<ShoppingItem>) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/lists/${listId}/items/${itemId}`, item);
      dispatch({
        type: 'UPDATE_ITEM_SUCCESS',
        payload: { listId, item: res.data },
      });
    } catch (err: any) {
      dispatch({
        type: 'SHOPPING_LIST_ERROR',
        payload: err.response?.data?.msg || 'Error updating item',
      });
    }
  };

  // Delete item
  const deleteItem = async (listId: string, itemId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/lists/${listId}/items/${itemId}`);
      dispatch({
        type: 'DELETE_ITEM_SUCCESS',
        payload: { listId, itemId },
      });
    } catch (err: any) {
      dispatch({
        type: 'SHOPPING_LIST_ERROR',
        payload: err.response?.data?.msg || 'Error deleting item',
      });
    }
  };

  // Share list with another user
  const shareList = async (listId: string, email: string) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/lists/${listId}/share`, { email });
      dispatch({ type: 'UPDATE_LIST_SUCCESS', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'SHOPPING_LIST_ERROR',
        payload: err.response?.data?.msg || 'Error sharing list',
      });
    }
  };

  return (
    <ShoppingListContext.Provider
      value={{
        state,
        getLists,
        getList,
        addList,
        updateList,
        deleteList,
        addItem,
        updateItem,
        deleteItem,
        shareList,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => useContext(ShoppingListContext);