import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaShoppingCart, FaHeart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Recommendation from '../components/Recommendation';
import './Product.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchSimilarProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Failed to load product:', err);
      setError('Failed to load product details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProducts = async () => {
    try {
      const response = await axios.post(`${API_URL}/recommendations/similar`, { productId: id });
      setSimilarProducts(response.data || []);
    } catch (err) {
      console.error('Failed to load similar products:', err);
      setSimilarProducts([]);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      setAddedToCart(true);
      
      // Show feedback for 1.5 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 1500);
    }
  };

  const formatIndianPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('en-IN').format(price);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-page">
        <div className="container">
          <div className="error-message">{error || 'Product not found'}</div>
          <button onClick={() => navigate('/')} className="back-home-btn">
            <FaArrowLeft /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/500x500?text=No+Image'];

  return (
    <div className="product-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft /> Back
        </button>

        <div className="product-details">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img 
                src={displayImages[selectedImage]} 
                alt={product.name || 'Product'} 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Found';
                }}
              />
            </div>
            {displayImages.length > 1 && (
              <div className="thumbnail-grid">
                {displayImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name || 'Product'} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name || 'Unnamed Product'}</h1>
            
            <div className="product-meta">
              {product.category && (
                <span className="product-category">{product.category}</span>
              )}
              {product.brand && (
                <span className="product-brand">{product.brand}</span>
              )}
            </div>

            <div className="product-rating">
              {[...Array(5)].map((_, index) => (
                <FaStar 
                  key={index} 
                  className={index < Math.floor(product.rating || 0) ? 'star-filled' : 'star-empty'} 
                />
              ))}
              <span className="rating-count">
                ({(product.rating || 0).toFixed(1)} • {product.reviews?.length || 0} reviews)
              </span>
            </div>

            <div className="product-price">
              <span className="current-price">₹{formatIndianPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="old-price">₹{formatIndianPrice(product.oldPrice)}</span>
              )}
            </div>

            <p className="product-description">
              {product.description || 'No description available.'}
            </p>

            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="product-actions">
              <button 
                className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                <FaShoppingCart /> 
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button className="wishlist-btn">
                <FaHeart /> Wishlist
              </button>
            </div>

            <div className="product-stock">
              {(product.stock || 0) > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        {similarProducts.length > 0 && (
          <Recommendation 
            title="You Might Also Like" 
            products={similarProducts}
            loading={false}
          />
        )}
      </div>
    </div>
  );
};

export default Product;