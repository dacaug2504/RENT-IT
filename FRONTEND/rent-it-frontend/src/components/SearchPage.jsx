import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronRight,
  MapPin,
  User,
  ArrowLeft,
  Package,
  Star,
  Clock,
  Shield,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import '../App.css';

const API_BASE_URL = 'http://localhost:5258/api/catalog';

const SearchPage = () => {
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
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      setCategories(data.data || []);
    } catch {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsByCategory = async (id, name) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}/items`);
      const data = await res.json();
      setItems(data.data || []);
      setSelectedCategory({ name });
      setCurrentView('category');
    } catch {
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const fetchItemDetail = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/items/${id}`);
      const data = await res.json();
      setItemDetail(data.data);
      setCurrentView('detail');
    } catch {
      setError('Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const queryToSearch = searchQuery; // Save query before clearing
    setLoading(true);
    
    try {
      const res = await fetch(
        `${API_BASE_URL}/search?query=${encodeURIComponent(queryToSearch)}`
      );
      const data = await res.json();

      const unique = [];
      const seen = new Set();
      data.data?.items?.forEach(i => {
        if (!seen.has(i.itemId)) {
          seen.add(i.itemId);
          unique.push(i);
        }
      });

      setItems(unique);
      setSelectedCategory({ name: `Search: "${queryToSearch}"` });
      setCurrentView('category');
      setSearchQuery(''); // Clear only after successful search
    } catch {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const goBack = () => {
    if (currentView === 'detail') {
      setCurrentView('category');
    } else {
      setCurrentView('home');
      setSelectedCategory(null);
    }
  };

  /* ================= HOME PAGE ================= */
  const HomePage = () => (
    <div className="dashboard">
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #a8e6cf 0%, #7fd1ae 50%, #b5ead7 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '2px solid var(--border-color)'
      }}>
        {/* Floating decorative elements */}
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          top: '-50px',
          left: '-50px',
          animation: 'floatLeaf 15s infinite ease-in-out'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          bottom: '-30px',
          right: '-30px',
          animation: 'floatLeaf 20s infinite ease-in-out reverse'
        }}></div>

        {/* Brand */}
        <div className="brand-logo">
          <div className="brand-icon">
            <Sparkles size={48} color="#5C4033" />
          </div>
          <h1 className="brand-title" style={{ marginBottom: '15px' }}>RENT-IT</h1>
          <p style={{
            fontSize: '20px',
            color: 'var(--text-dark)',
            fontWeight: '500',
            marginBottom: '40px'
          }}>
            Your One-Stop Rental Marketplace
          </p>
        </div>

        {/* Search Bar */}
        <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 20px 60px rgba(127, 209, 174, 0.3)',
            border: '2px solid var(--border-color)'
          }}>
            <Search size={24} color="var(--pastel-green-dark)" style={{ marginLeft: '10px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Search anything to rent…"
              style={{
                flex: 1,
                border: 'none',
                fontSize: '16px',
                padding: '12px',
                background: 'transparent',
                outline: 'none',
                color: 'var(--text-dark)'
              }}
            />
            <button 
              onClick={handleSearch}
              className="btn-primary"
              style={{
                padding: '12px 30px',
                margin: 0,
                whiteSpace: 'nowrap'
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Feature Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginTop: '30px'
        }}>
          {[
            { icon: Shield, text: 'Verified Owners' },
            { icon: Clock, text: 'Flexible Rentals' },
            { icon: Star, text: 'Best Prices' }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '10px 20px',
                borderRadius: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--text-dark)',
                boxShadow: '0 4px 15px rgba(168, 230, 207, 0.2)'
              }}>
                <Icon size={18} color="var(--pastel-green-dark)" />
                {feature.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories Section */}
      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: 'var(--text-dark)',
              marginBottom: '10px'
            }}>
              Browse Categories
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'var(--text-light)'
            }}>
              Find exactly what you need
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner-border" role="status"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '25px'
            }}>
              {categories.map(c => (
                <div
                  key={c.categoryId}
                  className="card"
                  onClick={() => fetchItemsByCategory(c.categoryId, c.type)}
                  style={{
                    cursor: 'pointer',
                    padding: '30px',
                    background: 'white',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--pastel-green) 0%, var(--pastel-green-dark) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <Package size={28} color="white" />
                  </div>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: 'var(--text-dark)',
                    marginBottom: '10px'
                  }}>
                    {c.type}
                  </h3>
                  <p style={{
                    color: 'var(--text-light)',
                    marginBottom: '15px',
                    fontSize: '15px',
                    lineHeight: '1.5'
                  }}>
                    {c.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span className="badge" style={{
                      background: 'var(--pastel-green-light)',
                      color: 'var(--text-dark)'
                    }}>
                      {c.itemCount} items
                    </span>
                    <ChevronRight size={20} color="var(--pastel-green-dark)" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* ================= CATEGORY PAGE ================= */
  const CategoryPage = () => (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button 
            className="btn-outline-secondary" 
            onClick={goBack}
            style={{
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} /> Back to Categories
          </button>

          <div className="welcome-card" style={{ marginBottom: '30px' }}>
            <h2 className="welcome-title">{selectedCategory?.name}</h2>
            <p className="welcome-text">
              {items.length} {items.length === 1 ? 'item' : 'items'} available
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner-border" role="status"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : items.length === 0 ? (
            <div className="welcome-card" style={{ textAlign: 'center' }}>
              <Package size={48} color="var(--text-light)" style={{ marginBottom: '15px' }} />
              <p style={{ color: 'var(--text-light)', fontSize: '18px' }}>
                No items found
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '25px'
            }}>
              {items.map(i => (
                <div
                  key={i.itemId}
                  className="card"
                  onClick={() => fetchItemDetail(i.itemId)}
                  style={{
                    cursor: 'pointer',
                    padding: '25px',
                    background: 'white'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '15px'
                  }}>
                    <h4 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: 'var(--text-dark)',
                      margin: 0,
                      flex: 1
                    }}>
                      {i.itemName}
                    </h4>
                    <ChevronRight size={20} color="var(--pastel-green-dark)" />
                  </div>
                  <p style={{
                    color: 'var(--text-light)',
                    marginBottom: '15px',
                    fontSize: '15px'
                  }}>
                    {i.categoryType}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <TrendingUp size={16} color="var(--pastel-green-dark)" />
                    <span style={{
                      color: 'var(--pastel-green-dark)',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {i.availableCount} available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* ================= ITEM DETAIL PAGE ================= */
  const ItemDetailPage = () => (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button 
            className="btn-outline-secondary" 
            onClick={goBack}
            style={{
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} /> Back to Items
          </button>

          <div className="welcome-card" style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--pastel-green) 0%, var(--pastel-green-dark) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package size={32} color="white" />
              </div>
              <div>
                <h2 className="welcome-title" style={{ marginBottom: '5px' }}>
                  {itemDetail?.itemName}
                </h2>
                <p className="welcome-text" style={{ margin: 0 }}>
                  Available Listings
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner-border" role="status"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : !itemDetail?.availableListings || itemDetail.availableListings.length === 0 ? (
            <div className="welcome-card" style={{ textAlign: 'center' }}>
              <Package size={48} color="var(--text-light)" style={{ marginBottom: '15px' }} />
              <p style={{ color: 'var(--text-light)', fontSize: '18px' }}>
                No listings available
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {itemDetail.availableListings.map(l => (
                <div
                  key={l.otId}
                  className="card"
                  style={{
                    padding: '25px',
                    background: 'white'
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '20px',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '15px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--pastel-green-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <User size={20} color="var(--pastel-green-dark)" />
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: 'var(--text-dark)',
                            margin: 0
                          }}>
                            {l.ownerName}
                          </h4>
                          <small style={{ color: 'var(--text-light)' }}>Owner</small>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-light)',
                        fontSize: '15px'
                      }}>
                        <MapPin size={18} color="var(--pastel-green-dark)" />
                        {l.cityName}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: 'var(--pastel-green-dark)',
                        lineHeight: '1'
                      }}>
                        ₹{l.rentPerDay}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--text-light)',
                        marginTop: '5px'
                      }}>
                        per day
                      </div>
                      <button 
                        className="btn-primary"
                        style={{
                          marginTop: '15px',
                          padding: '10px 20px',
                          fontSize: '14px'
                        }}
                      >
                        Rent Now
                      </button>
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

  return (
    <>
      {currentView === 'home' && <HomePage />}
      {currentView === 'category' && <CategoryPage />}
      {currentView === 'detail' && <ItemDetailPage />}
    </>
  );
};

export default SearchPage;