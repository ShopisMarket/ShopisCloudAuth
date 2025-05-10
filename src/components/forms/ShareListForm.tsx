import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ShareListFormProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

const ShareListForm: React.FC<ShareListFormProps> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(email);
      setEmail('');
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Share This List</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-grow">
          <Input
            placeholder="Enter email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            fullWidth
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          Share
        </Button>
      </form>
      <p className="mt-2 text-sm text-gray-600">
        This will allow the user to view and edit this shopping list.
      </p>
    </div>
  );
};

export default ShareListForm;