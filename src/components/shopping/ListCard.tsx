import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Edit, Trash, Share2 } from 'lucide-react';
import { ShoppingList } from '../../types';
import Button from '../ui/Button';

interface ListCardProps {
  list: ShoppingList;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

const ListCard: React.FC<ListCardProps> = ({ list, onDelete, onShare }) => {
  const purchasedItemsCount = list.items.filter(item => item.isPurchased).length;
  const totalItems = list.items.length;
  const totalSpent = list.items
    .filter(item => item.isPurchased)
    .reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const progress = totalItems > 0 ? (purchasedItemsCount / totalItems) * 100 : 0;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <ShoppingBag className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{list.name}</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onShare(list._id)}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Share list"
            >
              <Share2 className="h-4 w-4 text-gray-500" />
            </button>
            <Link
              to={`/lists/${list._id}/edit`}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Edit list"
            >
              <Edit className="h-4 w-4 text-gray-500" />
            </Link>
            <button
              onClick={() => onDelete(list._id)}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Delete list"
            >
              <Trash className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{purchasedItemsCount} of {totalItems} items</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Budget spent</p>
            <p className="text-lg font-semibold text-gray-900">
              ${totalSpent.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ ${list.totalBudget.toFixed(2)}</span>
            </p>
          </div>
          <Link to={`/lists/${list._id}`}>
            <Button variant="primary" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListCard;