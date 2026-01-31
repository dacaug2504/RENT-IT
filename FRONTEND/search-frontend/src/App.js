import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, MapPin, User, ArrowLeft, Home, Package, Star, Clock, Shield } from 'lucide-react';
import './App.css';

// API Base URL - Change this to your backend URL
const API_BASE_URL = 'http://localhost:5258/api/catalog';

const RentItApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [itemDetail, setItemDetail] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (err) {
      setError('Failed to load categories.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsByCategory = async (categoryId, categoryName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/items`);
      const data = await response.json();
      setItems(data.data || []);
      setSelectedCategory({ id: categoryId, name: categoryName });
      setCurrentView('category');
    } catch (err) {
      setError('Failed to load items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemDetail = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}`);
      const data = await response.json();
      setItemDetail(data.data || null);
      setCurrentView('detail');
    } catch (err) {
      setError('Failed to load item details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(trimmedQuery)}`);
      const data = await response.json();
      
      // Remove duplicates based on itemId
      const uniqueItems = [];
      const seenIds = new Set();
      
      if (data.data && data.data.items) {
        data.data.items.forEach(item => {
          if (!seenIds.has(item.itemId)) {
            seenIds.add(item.itemId);
            uniqueItems.push(item);
          }
        });
      }
      
      setItems(uniqueItems);
      setSelectedCategory({ name: `Search: "${trimmedQuery}"` });
      setCurrentView('category');
      setSearchQuery('');
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
    setItemDetail(null);
    setSearchQuery('');
    setError(null);
  };

  const goBack = () => {
    if (currentView === 'detail') {
      setCurrentView('category');
      setItemDetail(null);
    } else if (currentView === 'category') {
      setCurrentView('home');
      setSelectedCategory(null);
      setSearchQuery('');
    }
    setError(null);
  };

  // Category Icons
  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Furniture': '🪑',
      'Electronics': '📱',
      'Utensils': '🍴',
      'Kitchen Appliances': '🍳',
      'Cleaning Tools': '🧹'
    };
    return icons[categoryName] || '📦';
  };

  const HomePage = () => {
    const [localSearchQuery, setLocalSearchQuery] = useState('');

    useEffect(() => {
      setLocalSearchQuery('');
    }, [currentView]);

    const handleLocalSearch = async () => {
      const trimmedQuery = localSearchQuery.trim();
      if (!trimmedQuery) return;
      
      setSearchQuery(trimmedQuery);
      
      // Perform search immediately
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(trimmedQuery)}`);
        const data = await response.json();
        
        // Remove duplicates
        const uniqueItems = [];
        const seenIds = new Set();
        
        if (data.data && data.data.items) {
          data.data.items.forEach(item => {
            if (!seenIds.has(item.itemId)) {
              seenIds.add(item.itemId);
              uniqueItems.push(item);
            }
          });
        }
        
        setItems(uniqueItems);
        setSelectedCategory({ name: `Search: "${trimmedQuery}"` });
        setCurrentView('category');
        setSearchQuery('');
        setLocalSearchQuery('');
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const handleLocalKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleLocalSearch();
      }
    };

    return (
      <div className="app">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="container">
              <div className="hero-text">
                <h1 className="hero-title">
                  <span className="gradient-text">RENT-IT</span>
                </h1>
                <p className="hero-subtitle">Your One-Stop Rental Marketplace</p>
                <p className="hero-description">Rent anything, anytime, anywhere - from furniture to electronics</p>
              </div>
              
              {/* Search Bar */}
              <div className="search-container">
                <div className="search-box">
                  <Search className="search-icon" size={24} />
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    onKeyPress={handleLocalKeyPress}
                    className="search-input"
                  />
                  <button onClick={handleLocalSearch} className="search-btn">
                    Search
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="features">
                <div className="feature-item">
                  <Shield size={20} />
                  <span>Verified Owners</span>
                </div>
                <div className="feature-item">
                  <Clock size={20} />
                  <span>Flexible Duration</span>
                </div>
                <div className="feature-item">
                  <Star size={20} />
                  <span>Best Prices</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Find what you need from our wide selection</p>
            </div>
            
            {error && <div className="error-alert">{error}</div>}

            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading amazing deals...</p>
              </div>
            ) : (
              <div className="categories-grid">
                {categories.map((category) => (
                  <div
                    key={category.categoryId}
                    onClick={() => fetchItemsByCategory(category.categoryId, category.type)}
                    className="category-card"
                  >
                    <div className="category-icon-wrapper">
                      <span className="category-icon">{getCategoryIcon(category.type)}</span>
                    </div>
                    <div className="category-content">
                      <h3 className="category-title">{category.type}</h3>
                      <p className="category-desc">{category.description}</p>
                      <div className="category-footer">
                        <span className="category-count">
                          <Package size={16} />
                          {category.itemCount} items
                        </span>
                        <ChevronRight className="category-arrow" size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CategoryPage = () => (
    <div className="app">
      <div className="page-header">
        <div className="container">
          <button onClick={goBack} className="back-btn">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="page-title">{selectedCategory?.name}</h1>
          <p className="page-subtitle">Choose from our available items</p>
        </div>
      </div>

      <div className="content-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading items...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <Package size={64} />
              <h3>No items found</h3>
              <p>Try searching for something else</p>
            </div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div
                  key={item.itemId}
                  onClick={() => fetchItemDetail(item.itemId)}
                  className="item-card"
                >
                  <div className="item-image-wrapper">
                    <div className="item-image">
                      <span className="item-emoji">📦</span>
                    </div>
                    <div className="item-badge">
                      {item.availableCount} Available
                    </div>
                  </div>
                  <div className="item-content">
                    <h3 className="item-title">{item.itemName}</h3>
                    <p className="item-category">{item.categoryType}</p>
                    <div className="item-action">
                      <span className="view-details">View Details</span>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ItemDetailPage = () => (
    <div className="app">
      <div className="page-header">
        <div className="container">
          <button onClick={goBack} className="back-btn">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="breadcrumb">
            <button onClick={goHome} className="breadcrumb-link">
              <Home size={16} />
              Home
            </button>
            <ChevronRight size={14} />
            <span className="breadcrumb-item">{itemDetail?.categoryType}</span>
            <ChevronRight size={14} />
            <span className="breadcrumb-active">{itemDetail?.itemName}</span>
          </div>
          
          <h1 className="page-title">{itemDetail?.itemName}</h1>
          <p className="page-subtitle">{itemDetail?.availableListings?.length || 0} rental options available</p>
        </div>
      </div>

      <div className="content-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading rental options...</p>
            </div>
          ) : itemDetail?.availableListings?.length === 0 ? (
            <div className="empty-state">
              <Package size={64} />
              <h3>No rentals available</h3>
              <p>Check back later for new listings</p>
            </div>
          ) : (
            <div className="listings-grid">
              {itemDetail?.availableListings?.map((listing) => (
                <div key={listing.otId} className="listing-card">
                  {/* Owner Header */}
                  <div className="listing-owner">
                    <div className="owner-avatar">
                      <User size={24} />
                    </div>
                    <div className="owner-details">
                      <h4 className="owner-name">{listing.ownerName}</h4>
                      <p className="owner-location">
                        <MapPin size={14} />
                        {listing.cityName}, {listing.stateName}
                      </p>
                    </div>
                    <span className={`status-tag status-${listing.status.toLowerCase().replace(' ', '-')}`}>
                      {listing.status}
                    </span>
                  </div>

                  {/* Listing Details */}
                  <div className="listing-details">
                    <div className="brand-section">
                      <h3 className="brand-name">{listing.brand}</h3>
                      <span className={`condition-tag condition-${listing.condition.toLowerCase().replace(' ', '-')}`}>
                        {listing.condition}
                      </span>
                    </div>
                    <p className="listing-description">{listing.description}</p>
                  </div>

                  {/* Pricing Card */}
                  <div className="pricing-card">
                    <div className="price-main">
                      <div className="price-label">Rent per day</div>
                      <div className="price-value">₹{listing.rentPerDay}</div>
                    </div>
                    <div className="price-divider"></div>
                    <div className="price-secondary">
                      <div className="price-label">Deposit Amount</div>
                      <div className="deposit-value">₹{listing.depositAmt}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="rent-now-btn">
                    <span>Rent Now</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {currentView === 'home' && <HomePage />}
      {currentView === 'category' && <CategoryPage />}
      {currentView === 'detail' && <ItemDetailPage />}
    </div>
  );
};

export default RentItApp;