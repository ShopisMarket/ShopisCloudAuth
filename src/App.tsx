import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShoppingListProvider } from './context/ShoppingListContext';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ListDetail from './pages/shopping/ListDetail';
import EditList from './pages/shopping/EditList';

// Define private route component
const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{element}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ShoppingListProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/lists/:id" element={<PrivateRoute element={<ListDetail />} />} />
            <Route path="/lists/:id/edit" element={<PrivateRoute element={<EditList />} />} />
          </Routes>
        </Router>
      </ShoppingListProvider>
    </AuthProvider>
  );
}

export default App;