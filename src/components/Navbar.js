import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaChevronDown } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
    }
  };

  const handleCategoryClick = (category, subcategory = null) => {
    if (subcategory) {
      navigate(`/?category=${subcategory}`);
    } else {
      navigate(`/?category=${category}`);
    }
    setActiveCategory(null);
  };

  const categories = [
    {
      name: 'Electronics',
      key: 'electronics',
      subcategories: [
        { name: 'All Electronics', key: 'electronics' },
        { name: 'Laptops', key: 'laptops' },
        { name: 'Smartphones', key: 'smartphones' },
        { name: 'Audio', key: 'audio' },
        { name: 'Wearables', key: 'wearables' },
        { name: 'Televisions', key: 'televisions' }
      ]
    },
    {
      name: 'Footwear',
      key: 'footwear',
      subcategories: [
        { name: 'All Footwear', key: 'footwear' },
        { name: 'Running Shoes', key: 'running' },
        { name: 'Casual Shoes', key: 'casual' },
        { name: 'Sports Shoes', key: 'sports' }
      ]
    },
    {
      name: 'Clothing',
      key: 'clothing',
      subcategories: [
        { name: 'All Clothing', key: 'clothing' },
        { name: 'Jeans', key: 'jeans' },
        { name: 'T-Shirts', key: 'tshirts' },
        { name: 'Shirts', key: 'shirts' },
        { name: 'Jackets', key: 'jackets' }
      ]
    },
    {
      name: 'Home & Kitchen',
      key: 'home',
      subcategories: [
        { name: 'All Home', key: 'home' },
        { name: 'Kitchen', key: 'kitchen' },
        { name: 'Appliances', key: 'appliances' },
        { name: 'Furniture', key: 'furniture' }
      ]
    }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Picksy</span>
          <span className="logo-ai">AI</span>
        </Link>

        {/* Category Navigation - Simple and Small */}
        <ul className="category-nav">
          {categories.map((category) => (
            <li 
              key={category.key}
              className="category-nav-item"
              onMouseEnter={() => setActiveCategory(category.key)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <span className="category-nav-link">
                {category.name} <FaChevronDown className="dropdown-icon" />
              </span>
              
              {/* Dropdown Menu - Appears on Hover */}
              {activeCategory === category.key && (
                <div className="dropdown-menu">
                  {category.subcategories.map((sub) => (
                    <div
                      key={sub.key}
                      className="dropdown-item"
                      onClick={() => handleCategoryClick(category.key, sub.key)}
                    >
                      {sub.name}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <div className="nav-links">
          <Link to="/cart" className="nav-link">
            <FaShoppingCart />
            <span className="cart-count">{cartCount}</span>
          </Link>
          <Link to="/profile/guest" className="nav-link">
            <FaUser />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;