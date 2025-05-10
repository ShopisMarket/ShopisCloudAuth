import React, { useState } from 'react';
import { Check, X, Edit2 } from 'lucide-react';
import { ShoppingItem } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ItemRowProps {
  item: ShoppingItem;
  onTogglePurchased: (id: string, isPurchased: boolean) => void;
  onUpdate: (id: string, data: Partial<ShoppingItem>) => void;
  onDelete: (id: string) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, onTogglePurchased, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedQuantity, setEditedQuantity] = useState(item.quantity);
  const [editedPrice, setEditedPrice] = useState(item.price);
  
  const handleSave = () => {
    onUpdate(item._id, {
      name: editedName,
      quantity: editedQuantity,
      price: editedPrice,
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedName(item.name);
    setEditedQuantity(item.quantity);
    setEditedPrice(item.price);
    setIsEditing(false);
  };
  
  return (
    <div className={`border-b border-gray-200 py-3 ${item.isPurchased ? 'bg-gray-50' : ''}`}>
      {isEditing ? (
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-grow min-w-[200px]">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Item name"
              fullWidth
            />
          </div>
          <div className="w-20">
            <Input
              type="number"
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(parseInt(e.target.value, 10))}
              min={1}
              fullWidth
            />
          </div>
          <div className="w-24">
            <Input
              type="number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(parseFloat(e.target.value))}
              min={0}
              step={0.01}
              fullWidth
            />
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="primary" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={item.isPurchased}
              onChange={() => onTogglePurchased(item._id, !item.isPurchased)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className={`${item.isPurchased ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {item.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="text-gray-600 mr-1">Qty:</span>
              <span className="font-medium">{item.quantity}</span>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-600 mr-1">Price:</span>
              <span className="font-medium">${item.price.toFixed(2)}</span>
            </div>
            
            <div className="text-sm font-medium">
              <span className="text-gray-600 mr-1">Total:</span>
              <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Edit item"
              >
                <Edit2 className="h-4 w-4 text-gray-500" />
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Delete item"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemRow;