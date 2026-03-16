import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaHistory, FaHeart, FaShoppingBag } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import './Profile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('browsing');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId !== 'guest') {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (userId === 'guest') {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="guest-message">
            <FaUser size={50} />
            <h2>Guest User</h2>
            <p>You are browsing as a guest. Sign in to see your personalized profile!</p>
            <button className="login-btn">Log In / Sign Up</button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return <div className="error-message">{error || 'User not found'}</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <div className="profile-info">
            <h1>{user.fullName || user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-member-since">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'browsing' ? 'active' : ''}`}
            onClick={() => setActiveTab('browsing')}
          >
            <FaHistory /> Browsing History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'purchases' ? 'active' : ''}`}
            onClick={() => setActiveTab('purchases')}
          >
            <FaShoppingBag /> Purchase History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            <FaHeart /> Saved Recommendations
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'browsing' && (
            <div className="history-grid">
              {user.browsingHistory && user.browsingHistory.length > 0 ? (
                user.browsingHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    {item.productId && <ProductCard product={item.productId} />}
                  </div>
                ))
              ) : (
                <p className="empty-message">No browsing history yet</p>
              )}
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="history-grid">
              {user.purchaseHistory && user.purchaseHistory.length > 0 ? (
                user.purchaseHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    {item.productId && (
                      <>
                        <ProductCard product={item.productId} />
                        <p className="purchase-date">
                          Purchased: {new Date(item.purchasedAt).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="empty-message">No purchase history yet</p>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="history-grid">
              {user.savedRecommendations && user.savedRecommendations.length > 0 ? (
                user.savedRecommendations.map((item, index) => (
                  <div key={index} className="history-item">
                    {item.productId && (
                      <>
                        <ProductCard product={item.productId} />
                        <p className="recommendation-reason">{item.reason}</p>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="empty-message">No saved recommendations yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;