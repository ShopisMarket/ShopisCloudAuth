import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Edit, Trash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShoppingList } from '../../context/ShoppingListContext';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import ItemForm from '../../components/forms/ItemForm';
import ItemRow from '../../components/shopping/ItemRow';
import ShareListForm from '../../components/forms/ShareListForm';
import { ShoppingItem } from '../../types';

const ListDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const {
    state: listState,
    getList,
    updateList,
    deleteList,
    addItem,
    updateItem,
    deleteItem,
    shareList,
  } = useShoppingList();
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, authState.isLoading, navigate]);

  useEffect(() => {
    if (id && authState.isAuthenticated) {
      getList(id);
    }
  }, [id, authState.isAuthenticated, getList]);

  const handleAddItem = async (itemData: Omit<ShoppingItem, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (id) {
      await addItem(id, itemData);
    }
  };

  const handleTogglePurchased = async (itemId: string, isPurchased: boolean) => {
    if (id) {
      await updateItem(id, itemId, { isPurchased });
    }
  };

  const handleUpdateItem = async (itemId: string, data: Partial<ShoppingItem>) => {
    if (id) {
      await updateItem(id, itemId, data);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (id) {
      await deleteItem(id, itemId);
    }
  };

  const handleShare = async (email: string) => {
    if (id) {
      await shareList(id, email);
      setIsSharing(false);
    }
  };

  const handleDeleteList = async () => {
    if (id) {
      await deleteList(id);
      navigate('/dashboard');
    }
  };

  if (listState.isLoading || !listState.currentList) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const totalBudget = listState.currentList.totalBudget;
  const totalSpent = listState.currentList.items
    .filter(item => item.isPurchased)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isPurchased = listState.currentList.items.filter(item => item.isPurchased);
  const totalItems = listState.currentList.items.length;
  const progressPercentage = totalItems > 0 ? (isPurchased.length / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Lists
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{listState.currentList.name}</h1>
              <p className="text-gray-600 mt-1">
                Created {new Date(listState.currentList.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsSharing(!isSharing)}
                className="flex items-center"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/lists/${id}/edit`)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteList}
                className="flex items-center"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Budget Status</h2>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Spent</span>
                <span>${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                    budgetProgress > 100 ? 'bg-red-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Remaining Budget</p>
                  <p className={`text-lg font-semibold ${remainingBudget < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    ${remainingBudget.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {isPurchased.length} of {totalItems} items
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shopping Progress</h2>
              {totalItems === 0 ? (
                <p className="text-gray-600">No items in this list yet.</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Purchased</span>
                    <span className="text-gray-900 font-medium">{isPurchased.length} items</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className="text-gray-900 font-medium">{totalItems - isPurchased.length} items</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items</span>
                    <span className="text-gray-900 font-medium">{totalItems} items</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {isSharing && (
            <ShareListForm
              onSubmit={handleShare}
              isLoading={listState.isLoading}
            />
          )}
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Shopping Items</h2>
            </div>
            
            <ItemForm onSubmit={handleAddItem} isLoading={listState.isLoading} />
            
            <div className="divide-y divide-gray-200">
              {listState.currentList.items.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No items in this list yet. Add your first item above.
                </div>
              ) : (
                <div className="px-6">
                  {listState.currentList.items.map(item => (
                    <ItemRow
                      key={item._id}
                      item={item}
                      onTogglePurchased={handleTogglePurchased}
                      onUpdate={handleUpdateItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListDetail;
