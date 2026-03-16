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
    search: false,
    category: false
  });
  const [error, setError] = useState({
    recommendations: null,
    trending: null,
    search: null,
    category: null
  });
  
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
      setLoading(prev => ({ ...prev, recommendations: true }));
      setError(prev => ({ ...prev, recommendations: null }));
      
      // For demo, using a default user ID
      const userId = 'guest';
      const response = await axios.get(`${API_URL}/recommendations/user/${userId}`);
      setRecommendedProducts(response.data || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setError(prev => ({ 
        ...prev, 
        recommendations: 'Failed to load recommendations. Please try again later.' 
      }));
      setRecommendedProducts([]);
    } finally {
      setLoading(prev => ({ ...prev, recommendations: false }));
    }
  };

  const fetchTrending = async () => {
    try {
      setLoading(prev => ({ ...prev, trending: true }));
      setError(prev => ({ ...prev, trending: null }));
      
      const response = await axios.get(`${API_URL}/recommendations/trending`);
      setTrendingProducts(response.data || []);
    } catch (err) {
      console.error('Failed to load trending products:', err);
      setError(prev => ({ 
        ...prev, 
        trending: 'Failed to load trending products. Please try again later.' 
      }));
      setTrendingProducts([]);
    } finally {
      setLoading(prev => ({ ...prev, trending: false }));
    }
  };

  const searchProducts = async (query) => {
    try {
      setLoading(prev => ({ ...prev, search: true }));
      setError(prev => ({ ...prev, search: null }));
      
      const response = await axios.get(`${API_URL}/products?search=${encodeURIComponent(query)}`);
      setSearchResults(response.data?.products || response.data || []);
    } catch (err) {
      console.error('Failed to search products:', err);
      setError(prev => ({ 
        ...prev, 
        search: 'Failed to search products. Please try again later.' 
      }));
      setSearchResults([]);
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  const fetchProductsByCategory = async (category) => {
    try {
      setLoading(prev => ({ ...prev, category: true }));
      setError(prev => ({ ...prev, category: null }));
      
      const response = await axios.get(`${API_URL}/products?category=${encodeURIComponent(category)}`);
      setSearchResults(response.data?.products || response.data || []);
    } catch (err) {
      console.error('Failed to load category products:', err);
      setError(prev => ({ 
        ...prev, 
        category: 'Failed to load products in this category.' 
      }));
      setSearchResults([]);
    } finally {
      setLoading(prev => ({ ...prev, category: false }));
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
    return categoryNames[category] || category?.charAt(0).toUpperCase() + category?.slice(1) || 'Category';
  };

  // Handle category card click
  const handleCategoryClick = (category) => {
    window.location.href = `/?category=${category}`;
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
        {/* Global error message */}
        {Object.values(error).some(e => e) && (
          <div className="error-banner">
            {Object.entries(error).map(([key, msg]) => msg && (
              <div key={key} className="error-message">{msg}</div>
            ))}
          </div>
        )}

        {searchQuery ? (
          <section className="search-results">
            <h2>Search Results for "{searchQuery}"</h2>
            {loading.search ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="products-grid">
                {searchResults.length > 0 ? (
                  searchResults.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="no-results">
                    <p>No products found matching "{searchQuery}".</p>
                    <button onClick={() => window.location.href = '/'} className="browse-all-btn">
                      Browse All Products
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : selectedCategory ? (
          <section className="category-results">
            <h2>{getCategoryDisplayName(selectedCategory)}</h2>
            {loading.category ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="products-grid">
                {searchResults.length > 0 ? (
                  searchResults.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="no-results">
                    <p>No products found in this category.</p>
                    <button onClick={() => window.location.href = '/'} className="browse-all-btn">
                      Browse All Categories
                    </button>
                  </div>
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
              error={error.recommendations}
            />
            
            <Recommendation 
              title="Trending Now" 
              products={trendingProducts}
              loading={loading.trending}
              error={error.trending}
            />

            {/* Popular Categories Section */}
            <section className="popular-categories">
              <h2>Shop by Category</h2>
              <div className="categories-grid">
                <div className="category-card" onClick={() => handleCategoryClick('electronics')}>
                  <img 
                    src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop" 
                    alt="Electronics"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=Electronics';
                    }}
                  />
                  <h3>Electronics</h3>
                </div>
                <div className="category-card" onClick={() => handleCategoryClick('smartphones')}>
                  <img 
                    src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" 
                    alt="Smartphones"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=Smartphones';
                    }}
                  />
                  <h3>Smartphones</h3>
                </div>
                <div className="category-card" onClick={() => handleCategoryClick('laptops')}>
                  <img 
                    src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop" 
                    alt="Laptops"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=Laptops';
                    }}
                  />
                  <h3>Laptops</h3>
                </div>
                <div className="category-card" onClick={() => handleCategoryClick('audio')}>
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" 
                    alt="Audio"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=Audio';
                    }}
                  />
                  <h3>Audio</h3>
                </div>
                <div className="category-card" onClick={() => handleCategoryClick('footwear')}>
                  <img 
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" 
                    alt="Footwear"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=Footwear';
                    }}
                  />
                  <h3>Footwear</h3>
                </div>
                <div className="category-card" onClick={() => handleCategoryClick('clothing')}>
                  <img 
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop" 
                    alt="Clothing"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=Clothing';
                    }}
                  />
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