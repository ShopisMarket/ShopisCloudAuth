import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ShoppingItem } from '../../types';

interface ItemFormProps {
  onSubmit: (data: Omit<ShoppingItem, '_id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, isLoading = false }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('0.00');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    const qtyValue = parseInt(quantity, 10);
    if (isNaN(qtyValue) || qtyValue <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      newErrors.price = 'Price must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        name,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
        isPurchased: false,
      });
      
      // Reset form
      setName('');
      setQuantity('1');
      setPrice('0.00');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Item</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Input
            label="Item Name"
            placeholder="Enter item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            fullWidth
            required
          />
        </div>
        
        <div>
          <Input
            label="Quantity"
            type="number"
            min="1"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            error={errors.quantity}
            fullWidth
            required
          />
        </div>
        
        <div>
          <Input
            label="Price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors.price}
            fullWidth
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          Add Item
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;