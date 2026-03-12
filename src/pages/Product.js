import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import Recommendation from '../components/Recommendation';
import './Product.css';

const API_URL = 'http://localhost:5000/api';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
    fetchSimilarProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load product');
      setLoading(false);
    }
  };

  const fetchSimilarProducts = async () => {
    try {
      const response = await axios.post(`${API_URL}/recommendations/similar`, { productId: id });
      setSimilarProducts(response.data);
    } catch (err) {
      console.error('Failed to load similar products');
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="error-message">{error || 'Product not found'}</div>;
  }

  return (
    <div className="product-page">
      <div className="container">
        <div className="product-details">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img 
                src={product.images?.[selectedImage] || 'https://via.placeholder.com/500x500'} 
                alt={product.name} 
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-grid">
                {product.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <span className="product-category">{product.category}</span>
              {product.brand && <span className="product-brand">{product.brand}</span>}
            </div>

            <div className="product-rating">
              {[...Array(5)].map((_, index) => (
                <FaStar 
                  key={index} 
                  className={index < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} 
                />
              ))}
              <span className="rating-count">({product.reviews?.length || 0} reviews)</span>
            </div>

            <div className="product-price">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="old-price">${product.oldPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

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
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="wishlist-btn">
                <FaHeart /> Wishlist
              </button>
            </div>

            <div className="product-stock">
              {product.stock > 0 ? (
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