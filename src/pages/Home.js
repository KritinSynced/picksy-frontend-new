import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Recommendation from '../components/Recommendation';
import ProductCard from '../components/ProductCard';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState({
    recommendations: true,
    trending: true,
    search: false
  });
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  const categoryQuery = searchParams.get('category');

  useEffect(() => {
    fetchRecommendations();
    fetchTrending();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchProducts(searchQuery);
    } else if (categoryQuery) {
      setSelectedCategory(categoryQuery);
      fetchProductsByCategory(categoryQuery);
    } else {
      setSearchResults([]);
      setSelectedCategory('');
    }
  }, [searchQuery, categoryQuery]);

  const fetchRecommendations = async () => {
    try {
      // For demo, using a default user ID
      const userId = 'guest';
      const response = await axios.get(`${API_URL}/recommendations/user/${userId}`);
      setRecommendedProducts(response.data);
      setLoading(prev => ({ ...prev, recommendations: false }));
    } catch (err) {
      setError('Failed to load recommendations');
      setLoading(prev => ({ ...prev, recommendations: false }));
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommendations/trending`);
      setTrendingProducts(response.data);
      setLoading(prev => ({ ...prev, trending: false }));
    } catch (err) {
      setError('Failed to load trending products');
      setLoading(prev => ({ ...prev, trending: false }));
    }
  };

  const searchProducts = async (query) => {
    setLoading(prev => ({ ...prev, search: true }));
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/products?search=${query}`);
      setSearchResults(response.data);
      setLoading(prev => ({ ...prev, search: false }));
    } catch (err) {
      setError('Failed to search products');
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  const fetchProductsByCategory = async (category) => {
    setLoading(prev => ({ ...prev, search: true }));
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/products?category=${category}`);
      setSearchResults(response.data);
      setLoading(prev => ({ ...prev, search: false }));
    } catch (err) {
      setError('Failed to load products');
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  // Get category display name
  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'electronics': 'Electronics',
      'laptops': 'Laptops',
      'smartphones': 'Smartphones',
      'audio': 'Audio',
      'wearables': 'Wearables',
      'televisions': 'Televisions',
      'footwear': 'Footwear',
      'running': 'Running Shoes',
      'casual': 'Casual Shoes',
      'sports': 'Sports Shoes',
      'clothing': 'Clothing',
      'jeans': 'Jeans',
      'tshirts': 'T-Shirts',
      'shirts': 'Shirts',
      'jackets': 'Jackets',
      'home': 'Home & Kitchen',
      'kitchen': 'Kitchen',
      'appliances': 'Appliances',
      'furniture': 'Furniture'
    };
    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="home">
      <div className="hero-banner">
        <div className="container">
          <h1>Discover Your Next Favorite Thing</h1>
          <p>AI-powered recommendations personalized just for you</p>
        </div>
      </div>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        {searchQuery ? (
          <section className="search-results">
            <h2>Search Results for "{searchQuery}"</h2>
            {loading.search ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="products-grid">
                {searchResults.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
                {searchResults.length === 0 && (
                  <p className="no-results">No products found matching your search.</p>
                )}
              </div>
            )}
          </section>
        ) : selectedCategory ? (
          <section className="category-results">
            <h2>{getCategoryDisplayName(selectedCategory)}</h2>
            {loading.search ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="products-grid">
                {searchResults.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
                {searchResults.length === 0 && (
                  <p className="no-results">No products found in this category.</p>
                )}
              </div>
            )}
          </section>
        ) : (
          <>
            <Recommendation 
              title="Recommended for You" 
              products={recommendedProducts}
              loading={loading.recommendations}
            />
            
            <Recommendation 
              title="Trending Now" 
              products={trendingProducts}
              loading={loading.trending}
            />

            {/* Popular Categories Section */}
            <section className="popular-categories">
              <h2>Shop by Category</h2>
              <div className="categories-grid">
                <div className="category-card" onClick={() => window.location.href = '/?category=electronics'}>
                  <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop" alt="Electronics" />
                  <h3>Electronics</h3>
                </div>
                <div className="category-card" onClick={() => window.location.href = '/?category=smartphones'}>
                  <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" alt="Smartphones" />
                  <h3>Smartphones</h3>
                </div>
                <div className="category-card" onClick={() => window.location.href = '/?category=laptops'}>
                  <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop" alt="Laptops" />
                  <h3>Laptops</h3>
                </div>
                <div className="category-card" onClick={() => window.location.href = '/?category=audio'}>
                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" alt="Audio" />
                  <h3>Audio</h3>
                </div>
                <div className="category-card" onClick={() => window.location.href = '/?category=footwear'}>
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" alt="Footwear" />
                  <h3>Footwear</h3>
                </div>
                <div className="category-card" onClick={() => window.location.href = '/?category=clothing'}>
                  <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop" alt="Clothing" />
                  <h3>Clothing</h3>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;