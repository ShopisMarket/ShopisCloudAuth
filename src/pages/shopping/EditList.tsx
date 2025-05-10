import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShoppingList } from '../../context/ShoppingListContext';
import Header from '../../components/layout/Header';
import ListForm from '../../components/forms/ListForm';

const EditList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { state: listState, getList, updateList } = useShoppingList();

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

  const handleUpdateList = async (data: any) => {
    if (id) {
      await updateList(id, data);
      navigate(`/lists/${id}`);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => navigate(`/lists/${id}`)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to List Details
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Edit Shopping List</h1>
            </div>
            
            <div className="p-6">
              <ListForm
                initialData={listState.currentList}
                onSubmit={handleUpdateList}
                isLoading={listState.isLoading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditList;
