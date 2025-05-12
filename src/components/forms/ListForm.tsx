import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ShoppingList } from '../../types';

interface ListFormProps {
  initialData?: Partial<ShoppingList>;
  onSubmit: (data: Partial<ShoppingList>) => void;
  isLoading?: boolean;
}

const ListForm: React.FC<ListFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [budget, setBudget] = useState(initialData.totalBudget?.toString() || '100');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'List name is required';
    }
    
    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      newErrors.budget = 'Budget must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        name,
        totalBudget: parseFloat(budget),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="List Name"
        placeholder="Enter list name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        fullWidth
        required
      />
      
      <Input
        label="Budget"
        type="number"
        min="1"
        step="0.01"
        placeholder="Enter total budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        error={errors.budget}
        fullWidth
        required
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          fullWidth
        >
          {initialData._id ? 'Update List' : 'Create List'}
        </Button>
      </div>
    </form>
  );
};

export default ListForm;
