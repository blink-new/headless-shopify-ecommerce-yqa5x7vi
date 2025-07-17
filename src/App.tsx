import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/layout/Header';
import { HomePage } from './components/pages/HomePage';
import { ProductsPage } from './components/pages/ProductsPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Categories - Coming Soon</h1></div>} />
              <Route path="/about" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">About - Coming Soon</h1></div>} />
              <Route path="/contact" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Contact - Coming Soon</h1></div>} />
            </Routes>
          </main>

          <footer className="bg-muted/30 border-t mt-20">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">S</span>
                    </div>
                    <span className="font-bold text-xl">Store</span>
                  </div>
                  <p className="text-muted-foreground">
                    Your premium destination for quality products and exceptional shopping experience.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Shop</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><a href="/products" className="hover:text-foreground transition-colors">All Products</a></li>
                    <li><a href="/categories" className="hover:text-foreground transition-colors">Categories</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">New Arrivals</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Sale</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Support</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><a href="/contact" className="hover:text-foreground transition-colors">Contact Us</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Shipping</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Company</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><a href="/about" className="hover:text-foreground transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
                <p>&copy; 2024 Store. All rights reserved. Powered by Shopify.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </CartProvider>
  );
}

export default App;