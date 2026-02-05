import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button, Card, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, LogOut, Package, TrendingUp, X } from "lucide-react";

import "../assets/customer-dashboard.css";
import { cartService, ownerItemService } from "../services/api";
import { logoutThunk } from "../features/auth/authThunks";
import { persistor } from "../app/store";

const API_BASE_URL = 'http://localhost:8765/api/catalog';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ================= AUTH ================= */
  const { user } = useSelector((state) => state.auth);
  if (!user) return null;

  const displayName =
    user.firstName ||
    user.first_name ||
    user.name ||
    user.email?.split("@")[0] ||
    "User";

  /* ================= STATE ================= */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartSuccess, setCartSuccess] = useState(null);

  /* ==== SEARCH STATE ==== */
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const debounceTimerRef = useRef(null);

  /* ==== IMAGE HOVER SLIDER ==== */
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [imageIndices, setImageIndices] = useState({});

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await dispatch(logoutThunk());
    await persistor.purge();
    navigate("/search");
  };

  /* ================= SEARCH FUNCTIONALITY ================= */
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.success) {
        // Get unique item IDs
        const uniqueIds = [];
        const seen = new Set();
        data.data?.items?.forEach(i => {
          if (!seen.has(i.itemId)) {
            seen.add(i.itemId);
            uniqueIds.push(i.itemId);
          }
        });

        // Fetch details for each item
        const details = await Promise.all(
          uniqueIds.map(id =>
            fetch(`${API_BASE_URL}/items/${id}`).then(r => r.json())
          )
        );

        // Extract all listings with item names
        const allListings = details.flatMap(d =>
          (d.data?.availableListings || []).map(l => ({
            ...l,
            itemName: d.data?.itemName,
            itemId: d.data?.itemId
          }))
        );

        setSearchResults(allListings);
        setShowSearchResults(true);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  /* ================= DEBOUNCED SEARCH ================= */
  useEffect(() => {
    clearTimeout(debounceTimerRef.current);

    if (searchQuery.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }

    return () => clearTimeout(debounceTimerRef.current);
  }, [searchQuery]);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ownerItemService.getAllProducts();
        setProducts(res.data || []);

        const indices = {};
        (res.data || []).forEach((p) => (indices[p.ot_id] = 0));
        setImageIndices(indices);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= IMAGE AUTO SLIDE ================= */
  useEffect(() => {
    if (!hoveredProduct) return;

    const product = products.find((p) => p.ot_id === hoveredProduct);
    if (!product) return;

    const images = [
      product.img1Base64,
      product.img2Base64,
      product.img3Base64,
      product.img4Base64,
      product.img5Base64,
    ].filter(Boolean);

    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setImageIndices((prev) => ({
        ...prev,
        [hoveredProduct]: (prev[hoveredProduct] + 1) % images.length,
      }));
    }, 800);

    return () => clearInterval(interval);
  }, [hoveredProduct, products]);

  const getCurrentImage = (p) => {
    const imgs = [
      p.img1Base64,
      p.img2Base64,
      p.img3Base64,
      p.img4Base64,
      p.img5Base64,
    ].filter(Boolean);

    return imgs[imageIndices[p.ot_id] || 0] || null;
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (id) => {
    try {
      await cartService.addToCart(id);
      setCartSuccess(id);
      setTimeout(() => setCartSuccess(null), 2000);
    } catch {
      setError("Unable to add item to cart");
    }
  };

  /* ================= CLEAR SEARCH ================= */
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  /* ================= DISPLAY PRODUCTS ================= */
  const displayedProducts = showSearchResults 
    ? [] // Hide regular products when showing search results
    : products;

  /* ================= UI ================= */
  return (
    <div className="dashboard-page">
      {/* Animated background orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* ================= NAVBAR ================= */}
      <Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
        <Container>
          <Navbar.Brand className="fw-bold text-primary">
            🏠 Rent-It
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto" style={{ alignItems: "center" }}>
              <Nav.Link onClick={() => navigate("/customer/dashboard")}>
                Home
              </Nav.Link>

              {/* Search bar — sits between Home and My Cart */}
              <div style={{
                display: "flex",
                alignItems: "center",
                background: "#f0f0f0",
                borderRadius: "20px",
                padding: "4px 8px 4px 14px",
                margin: "0 10px",
                width: "240px",
                position: "relative"
              }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search appliances…"
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    flex: 1,
                    fontSize: "14px",
                    color: "#333"
                  }}
                />
                {isSearching && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginRight: "4px"
                    }}
                  >
                    ⏳
                  </span>
                )}
                {searchQuery && !isSearching && (
                  <span
                    onClick={clearSearch}
                    style={{
                      cursor: "pointer",
                      color: "#999",
                      fontSize: "16px",
                      marginLeft: "4px",
                      lineHeight: 1
                    }}
                  >
                    ✕
                  </span>
                )}
              </div>

              <Nav.Link onClick={() => navigate("/mycart")}>
                🛒 My Cart
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/customer/bills")}>
                📜 My Bills
              </Nav.Link>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleLogout}
                className="ms-3"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ===== HERO ===== */}
      {!showSearchResults && (
        <section className="dashboard-hero">
          <Container>
            <motion.div 
              className="hero-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="hero-content">
                <motion.div 
                  className="hero-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  CUSTOMER PORTAL
                </motion.div>
                
                <motion.h1 
                  className="hero-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Welcome back,
                  <br />
                  <span className="name-highlight">{displayName}</span> 👋
                </motion.h1>
                
                <motion.p 
                  className="hero-subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Discover premium appliances for rent. Quality products, 
                  flexible terms, delivered to your doorstep.
                </motion.p>

                <motion.div 
                  className="hero-actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button 
                    className="action-btn-primary"
                    onClick={() => document.getElementById('appliances-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Package size={18} />
                    Browse Products
                  </Button>
                  <Button 
                    className="action-btn-secondary"
                    onClick={() => navigate("/mycart")}
                  >
                    <ShoppingCart size={18} />
                    View Cart
                  </Button>
                </motion.div>
              </div>

              <div className="hero-decoration">
                <div className="decoration-circle"></div>
                <div className="decoration-dots"></div>
              </div>
            </motion.div>
          </Container>
        </section>
      )}

      {/* ===== SEARCH RESULTS ===== */}
      {showSearchResults && (
        <section className="search-results-section">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="search-results-header">
                <h2 className="search-results-title">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="search-results-subtitle">
                  Found {searchResults.length} {searchResults.length === 1 ? 'listing' : 'listings'}
                </p>
                <Button 
                  className="btn-outline-secondary"
                  onClick={clearSearch}
                  style={{ marginTop: '15px' }}
                >
                  <X size={16} /> Clear Search
                </Button>
              </div>

              {searchResults.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No results found</h3>
                  <p>Try searching with different keywords</p>
                </div>
              ) : (
                <div className="search-results-grid">
                  <AnimatePresence mode="popLayout">
                    {searchResults.map((listing, index) => (
                      <motion.div
                        key={`${listing.otId}-${index}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="search-result-card"
                      >
                        <div className="search-result-header">
                          <span className="item-name-badge">{listing.itemName}</span>
                        </div>
                        
                        <div className="search-result-body">
                          <div className="owner-info">
                            <div className="owner-avatar">
                              {listing.ownerName?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <h4 className="owner-name">{listing.ownerName}</h4>
                              <p className="owner-location">📍 {listing.cityName}, {listing.stateName}</p>
                            </div>
                          </div>

                          <div className="listing-details">
                            <div className="listing-info">
                              <span className="info-label">Brand:</span>
                              <span className="info-value">{listing.brand}</span>
                            </div>
                            <div className="listing-info">
                              <span className="info-label">Condition:</span>
                              <span className="info-value">{listing.condition}</span>
                            </div>
                          </div>

                          <div className="search-result-footer">
                            <div className="price-info">
                              <div className="price">₹{listing.rentPerDay}</div>
                              <div className="price-label">per day</div>
                            </div>
                            <Button
                              className="btn-rent-now"
                              onClick={() => navigate(`/product/${listing.otId}`)}
                            >
                              View Details →
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </Container>
        </section>
      )}

      {/* ===== PRODUCTS ===== */}
      {!showSearchResults && (
        <section id="appliances-section" className="dashboard-products">
          <Container>
            <motion.div 
              className="products-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="products-title">Available Appliances</h2>
              <p className="products-subtitle">
                {displayedProducts.length} {displayedProducts.length === 1 ? 'product' : 'products'} available
              </p>
            </motion.div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="empty-icon">📦</div>
                <h3>No products found</h3>
                <p>No products available at the moment.</p>
              </motion.div>
            ) : (
              <Row className="g-4">
                <AnimatePresence mode="popLayout">
                  {displayedProducts.map((p, index) => {
                    const img = getCurrentImage(p);
                    const imgs = [
                      p.img1Base64,
                      p.img2Base64,
                      p.img3Base64,
                      p.img4Base64,
                      p.img5Base64,
                    ].filter(Boolean);

                    return (
                      <Col key={p.ot_id} md={6} lg={3}>
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ 
                            duration: 0.4,
                            delay: index * 0.05
                          }}
                        >
                          <Card 
                            className="product-card"
                            onMouseEnter={() => setHoveredProduct(p.ot_id)}
                            onMouseLeave={() => {
                              setHoveredProduct(null);
                              setImageIndices((prev) => ({ ...prev, [p.ot_id]: 0 }));
                            }}
                          >
                            <div className="product-image">
                              {img ? (
                                <motion.img 
                                  src={img} 
                                  alt={p.brand}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover' 
                                  }}
                                  key={img}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                />
                              ) : (
                                <div className="product-initial">
                                  {p.brand?.[0]?.toUpperCase() || "?"}
                                </div>
                              )}
                              <div className="product-overlay"></div>
                              
                              {imgs.length > 1 && (
                                <div className="image-indicators">
                                  {imgs.map((_, i) => (
                                    <span
                                      key={i}
                                      className={`indicator ${
                                        i === (imageIndices[p.ot_id] || 0) ? "active" : ""
                                      }`}
                                    ></span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <Card.Body className="product-body">
                              <h5 className="product-name">{p.brand}</h5>
                              <p className="product-description">{p.description}</p>

                              <div className="product-pricing">
                                <div className="product-price">
                                  <span>₹{p.rent_per_day}</span>
                                  <span className="price-unit">/day</span>
                                </div>
                              </div>

                              <div className="product-actions">
                                <Button
                                  className={`btn-add-cart ${cartSuccess === p.ot_id ? 'success' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(p.ot_id);
                                  }}
                                  disabled={cartSuccess === p.ot_id}
                                >
                                  {cartSuccess === p.ot_id ? (
                                    <>✓ Added</>
                                  ) : (
                                    <>
                                      <ShoppingCart size={16} />
                                      Add to Cart
                                    </>
                                  )}
                                </Button>

                                <Button
                                  className="btn-details"
                                  variant="outline-success"
                                  onClick={() => navigate(`/product/${p.ot_id}`)}
                                >
                                  View Details <span className="arrow">→</span>
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>
                    );
                  })}
                </AnimatePresence>
              </Row>
            )}
          </Container>
        </section>
      )}

      {/* ===== ERROR TOAST ===== */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="error-toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            {error}
            <button onClick={() => setError("")} className="toast-close">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerDashboard;