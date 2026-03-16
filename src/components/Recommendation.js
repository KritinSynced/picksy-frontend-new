import React from 'react';
import ProductCard from './ProductCard';
import './Recommendation.css';

const Recommendation = ({ title, products, loading, error }) => {
  if (loading) {
    return (
      <div className="recommendation-section">
        <h2>{title}</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-section">
        <h2>{title}</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="recommendation-section">
        <h2>{title}</h2>
        <div className="empty-message">No products to display</div>
      </div>
    );
  }

  return (
    <div className="recommendation-section">
      <h2>{title}</h2>
      <div className="recommendation-scroll">
        <div className="recommendation-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendation;