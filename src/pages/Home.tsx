import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Share, DollarSign, Check } from 'lucide-react';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="mb-8 lg:mb-0">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                  Organize Your Shopping Lists with Ease
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 mb-6">
                  Create, share and manage your shopping lists all in one place. 
                  Never forget an item or exceed your budget again.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => navigate('/register')}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Get Started
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="border-white text-white hover:bg-blue-700"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white p-6 rounded-lg shadow-lg transform rotate-3 animate-float">
                  <div className="font-medium text-gray-900 mb-3">Weekly Groceries</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 border border-gray-300 rounded-sm mr-2"></div>
                        <span>Milk</span>
                      </div>
                      <span className="text-gray-600">$3.99</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 text-white border border-blue-500 rounded-sm flex items-center justify-center mr-2">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="line-through text-gray-500">Eggs</span>
                      </div>
                      <span className="text-gray-500">$2.49</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 border border-gray-300 rounded-sm mr-2"></div>
                        <span>Bread</span>
                      </div>
                      <span className="text-gray-600">$1.99</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">$8.47</span>
                  </div>
                </div>
                
                <div className="absolute top-1/4 -right-4 bg-white p-4 rounded-lg shadow-lg transform -rotate-6 animate-float-delayed">
                  <div className="w-20 h-16 flex items-center justify-center">
                    <DollarSign className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 -left-6 bg-white p-4 rounded-lg shadow-lg transform rotate-12 animate-float">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <Share className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Features that make shopping easier</h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to organize your shopping efficiently
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Shopping Lists
                </h3>
                <p className="text-gray-600">
                  Create multiple shopping lists for different purposes. Add items, set quantities, and track prices.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Share className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Collaborative Sharing
                </h3>
                <p className="text-gray-600">
                  Share your lists with family and friends. Everyone can update the list in real-time.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Budget Tracking
                </h3>
                <p className="text-gray-600">
                  Set budgets for your shopping trips and track your spending in real-time as you shop.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    Ready to simplify your shopping?
                  </h2>
                  <p className="mt-3 max-w-lg text-lg text-blue-100">
                    Join thousands of users who have already streamlined their shopping experience.
                    Get started for free today!
                  </p>
                </div>
                <div className="mt-8 lg:mt-0 lg:ml-8">
                  <Button
                    size="lg"
                    onClick={() => navigate('/register')}
                    className="bg-[rgba(29,78,216,255)] text-white hover:bg-blue-700"
                  >
                    Sign Up Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ShoppingBag className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold">ShoppingListApp</span>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} ShoppingListApp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;