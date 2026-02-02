import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import "../assets/customer-dashboard.css";

import { cartService, ownerItemService } from "../services/api";
import { logoutThunk } from "../features/auth/authThunks";
import { persistor } from "../app/store";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔐 AUTH FROM REDUX (SOURCE OF TRUTH)
  const { user } = useSelector((state) => state.auth);

  // ⛔ Safety: if auth not ready (extra guard)
  if (!user) return null;

  // =========================
  // ✅ DISPLAY NAME (DYNAMIC)
  // =========================
  const displayName =
    user.firstName ||
    user.first_name ||
    user.name ||
    user.email?.split("@")[0] ||
    "User";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartSuccess, setCartSuccess] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Cache for search results
  const searchCacheRef = useRef(new Map());
  const debounceTimerRef = useRef(null);

  /* ============================
      🔄 LOGOUT (PROPER, REDUX)
     ============================ */
  const handleLogout = async () => {
    await dispatch(logoutThunk());
    await persistor.purge();
    navigate("/login");
  };

  /* ============================
      ⏳ DEBOUNCING LOGIC
     ============================ */
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchQuery.trim() !== "") {
      setIsSearching(true);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  /* ============================
      🔍 FILTER + CACHE SEARCH
     ============================ */
  const filteredProducts = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();

    if (query === "") return products;

    if (searchCacheRef.current.has(query)) {
      return searchCacheRef.current.get(query);
    }

    const results = products.filter((p) =>
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query))
    );

    searchCacheRef.current.set(query, results);

    if (searchCacheRef.current.size > 50) {
      const firstKey = searchCacheRef.current.keys().next().value;
      searchCacheRef.current.delete(firstKey);
    }

    return results;
  }, [products, debouncedSearchQuery]);

  /* ============================
      📦 FETCH PRODUCTS
     ============================ */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ownerItemService.getAllProducts();
        setProducts(res.data || []);
        searchCacheRef.current.clear();
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ============================
      🛒 ADD TO CART
     ============================ */
  const handleAddToCart = async (ownerItemId) => {
    try {
      await cartService.addToCart(ownerItemId);
      setCartSuccess(ownerItemId);
      setTimeout(() => setCartSuccess(null), 2000);
    } catch (err) {
      setError("Unable to add item to cart");
      console.error(err);
    }
  };

  /* ============================
      ❌ CLEAR SEARCH
     ============================ */
  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setIsSearching(false);
  };

  return (
    <div className="dashboard-page">
      {/* ================= NAVBAR ================= */}
      <Navbar bg="white" expand="lg" className="custom-navbar shadow-sm sticky-top">
        <Container>
          <Navbar.Brand className="brand-logo">
            🏠 Rent-It
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto nav-items">
              <Nav.Link 
                onClick={() => navigate("/customer/dashboard")}
                className="nav-link-custom"
              >
                Home
              </Nav.Link>

              {/* Enhanced Search Bar */}
              <div className="search-container">
                <div className="search-icon">🔍</div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search appliances…"
                  className="search-input"
                />
                {isSearching && <span className="search-loader">⏳</span>}
                {searchQuery && !isSearching && (
                  <span
                    onClick={handleClearSearch}
                    className="search-clear"
                  >
                    ✕
                  </span>
                )}
              </div>

              <Nav.Link 
                onClick={() => navigate("/mycart")}
                className="nav-link-custom cart-link"
              >
                🛒 My Cart
              </Nav.Link>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ================= HERO ================= */}
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
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                CUSTOMER ACCOUNT
              </motion.div>

              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Welcome back, <span className="name-highlight">{displayName}</span>! 👋
              </motion.h1>

              <motion.p 
                className="hero-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Browse and rent reliable home appliances from nearby owners.
              </motion.p>

              <motion.div 
                className="hero-actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button
                  className="action-btn-primary"
                  onClick={() =>
                    document
                      .getElementById("appliances-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Browse Appliances
                </Button>

                <Button
                  className="action-btn-secondary"
                  onClick={() => navigate("/mycart")}
                >
                  View My Cart
                </Button>
              </motion.div>
            </div>

            {/* Decorative Element */}
            <div className="hero-decoration">
              <div className="decoration-circle"></div>
              <div className="decoration-dots"></div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="dashboard-products" id="appliances-section">
        <Container>
          <motion.div 
            className="products-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="products-title">Available Appliances</h2>
            <p className="products-subtitle">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available for rent
            </p>
          </motion.div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading appliances...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or browse all items</p>
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {filteredProducts.map((p, index) => (
                <Col key={p.ot_id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1 
                    }}
                  >
                    <Card className="product-card">
                      <div className="product-image">
                        <div className="product-initial">
                          {p.brand?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="product-overlay"></div>
                      </div>

                      <Card.Body className="product-body">
                        <h5 className="product-name">{p.brand}</h5>
                        <p className="product-description">{p.description}</p>
                        
                        <div className="product-pricing">
                          <div className="product-price">₹{p.rent_per_day}/day</div>
                        </div>

                        <div className="product-actions">
                          <Button
                            className="btn-add-cart"
                            disabled={cartSuccess === p.ot_id}
                            onClick={() => handleAddToCart(p.ot_id)}
                          >
                            {cartSuccess === p.ot_id ? (
                              <>✓ Added to Cart</>
                            ) : (
                              <>🛒 Add to Cart</>
                            )}
                          </Button>

                          <Button
                            className="btn-details"
                            onClick={() => navigate(`/product/${p.ot_id}`)}
                          >
                            View Details →
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default CustomerDashboard;