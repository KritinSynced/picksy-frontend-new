import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingBag, FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatIndianPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const calculateShipping = () => {
    return cartTotal > 500 ? 0 : 40;
  };

  const calculateFinalTotal = () => {
    return cartTotal + calculateShipping();
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingBag className="empty-cart-icon" />
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="continue-shopping-btn">
              <FaArrowLeft /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'} 
                    alt={item.name || 'Product'} 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                    }}
                  />
                </div>
                
                <div className="cart-item-details">
                  <Link to={`/product/${item._id}`} className="cart-item-name">
                    {item.name || 'Unnamed Product'}
                  </Link>
                  <p className="cart-item-category">{item.category || 'Uncategorized'}</p>
                  <p className="cart-item-price">₹{formatIndianPrice(item.price)}</p>
                </div>
                
                <div className="cart-item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-value">{item.quantity || 1}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <div className="cart-item-total">
                  <p>₹{formatIndianPrice((item.price || 0) * (item.quantity || 1))}</p>
                </div>
                
                <button 
                  className="remove-item"
                  onClick={() => removeFromCart(item._id)}
                  aria-label="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            
            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{formatIndianPrice(cartTotal)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{calculateShipping() === 0 ? 'Free' : `₹${formatIndianPrice(calculateShipping())}`}</span>
            </div>
            
            {calculateShipping() > 0 && (
              <div className="shipping-note">
                Add ₹{formatIndianPrice(500 - cartTotal)} more for free shipping
              </div>
            )}
            
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{formatIndianPrice(calculateFinalTotal())}</span>
            </div>
            
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
            
            <Link to="/" className="continue-link">
              <FaArrowLeft /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;