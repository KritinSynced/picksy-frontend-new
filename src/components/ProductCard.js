import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { _id, name, price, images, rating, category } = product;
  const { addToCart } = useCart();

  // Format price with Indian numbering system
  const formatIndianPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event bubbling
    addToCart(product, 1);
    
    // Show feedback
    const button = e.currentTarget;
    const originalText = button.innerHTML;
    button.innerHTML = '✓ Added!';
    button.style.background = '#28a745';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 1500);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${_id}`} className="product-link">
        <div className="product-image">
          <img 
            src={images && images[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
            alt={name} 
          />
          <span className="product-category">{category}</span>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          
          <div className="product-rating">
            {[...Array(5)].map((_, index) => (
              <FaStar 
                key={index} 
                className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'} 
              />
            ))}
            <span className="rating-text">({rating || 0})</span>
          </div>
          
          <div className="product-price">
            <span className="price">₹{formatIndianPrice(price)}</span>
          </div>
        </div>
      </Link>
      
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        <FaShoppingCart /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;