import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaCheck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { _id, name, price, images, rating, category } = product;
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Format price with Indian numbering system
  const formatIndianPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event bubbling
    
    const success = addToCart(product, 1);
    
    if (success) {
      setIsAdded(true);
      
      // Show feedback for 1.5 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    }
  };

  // Safe rating value
  const safeRating = rating || 0;
  const displayImage = images && images.length > 0 
    ? images[0] 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="product-card">
      <Link to={`/product/${_id}`} className="product-link">
        <div className="product-image">
          <img 
            src={displayImage} 
            alt={name || 'Product'} 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            }}
          />
          {category && <span className="product-category">{category}</span>}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{name || 'Unnamed Product'}</h3>
          
          <div className="product-rating">
            {[...Array(5)].map((_, index) => (
              <FaStar 
                key={index} 
                className={index < Math.floor(safeRating) ? 'star-filled' : 'star-empty'} 
              />
            ))}
            <span className="rating-text">({safeRating.toFixed(1)})</span>
          </div>
          
          <div className="product-price">
            <span className="price">₹{formatIndianPrice(price)}</span>
          </div>
        </div>
      </Link>
      
      <button 
        className={`add-to-cart-btn ${isAdded ? 'added' : ''}`} 
        onClick={handleAddToCart}
        disabled={isAdded}
      >
        {isAdded ? <><FaCheck /> Added!</> : <><FaShoppingCart /> Add to Cart</>}
      </button>
    </div>
  );
};

export default ProductCard;