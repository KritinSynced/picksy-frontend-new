import React from 'react';
import ProductCard from './ProductCard';
import './Recommendation.css';

const Recommendation = ({ title, products, loading }) => {
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

  if (!products || products.length === 0) {
    return null;
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