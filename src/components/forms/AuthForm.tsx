import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: { name?: string; email: string; password: string }) => void;
  isLoading?: boolean;
  error?: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    
    if (type === 'register' && !name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (type === 'register' && password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const data = type === 'register' ? { name, email, password } : { email, password };
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'register' && (
        <Input
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={formErrors.name}
          fullWidth
          required
        />
      )}
      
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={formErrors.email}
        fullWidth
        required
      />
      
      <Input
        label="Password"
        type="password"
        placeholder={type === 'register' ? 'Create a password' : 'Enter your password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={formErrors.password}
        fullWidth
        required
      />
      
      {error && <p className="text-red-600 text-sm">{error}</p>}
      
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          fullWidth
        >
          {type === 'register' ? 'Create Account' : 'Sign In'}
        </Button>
      </div>
      
      <p className="text-center text-sm text-gray-600 mt-4">
        {type === 'register' ? (
          <>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
};

export default AuthForm;
