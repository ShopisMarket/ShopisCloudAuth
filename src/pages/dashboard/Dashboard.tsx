import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShoppingList } from '../../context/ShoppingListContext';
import Header from '../../components/layout/Header';
import ListCard from '../../components/shopping/ListCard';
import Button from '../../components/ui/Button';
import ListForm from '../../components/forms/ListForm';

const Dashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: listState, getLists, addList, deleteList } = useShoppingList();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, authState.isLoading, navigate]);

  // Fetch lists on component mount
  useEffect(() => {
    if (authState.isAuthenticated) {
      getLists();
    }
  }, [authState.isAuthenticated, getLists]);

  const handleCreateList = async (data: any) => {
    await addList({
      name: data.name,
      items: [],
      owner: authState.user?._id || '',
      sharedWith: [],
      totalBudget: data.totalBudget || 0,
    });
    setIsCreating(false);
  };

  const handleShareList = (id: string) => {
    navigate(`/lists/${id}`);
  };

  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Shopping Lists</h1>
              <p className="text-gray-600 mt-1">Manage and organize all your shopping needs</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => setIsCreating(!isCreating)}
                className="flex items-center"
              >
                {isCreating ? (
                  'Cancel'
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-1" />
                    New List
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {isCreating && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Create New List</h2>
              <ListForm onSubmit={handleCreateList} isLoading={listState.isLoading} />
            </div>
          )}
          
          {listState.error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {listState.error}
            </div>
          )}
          
          {listState.isLoading && !isCreating ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : listState.lists.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shopping lists yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first shopping list to get started
              </p>
              <Button onClick={() => setIsCreating(true)} variant="primary">
                <Plus className="h-5 w-5 mr-1" />
                Create Your First List
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listState.lists.map(list => (
                <ListCard
                  key={list._id}
                  list={list}
                  onDelete={deleteList}
                  onShare={handleShareList}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
