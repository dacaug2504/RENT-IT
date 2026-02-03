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
import { motion, AnimatePresence } from "framer-motion";

import "../assets/customer-dashboard.css";
import { cartService, ownerItemService } from "../services/api";
import { logoutThunk } from "../features/auth/authThunks";
import { persistor } from "../app/store";

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

  /* ==== SEARCH (DEBOUNCED + CACHED) ==== */
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchCacheRef = useRef(new Map());
  const debounceTimerRef = useRef(null);

  /* ==== IMAGE HOVER SLIDER ==== */
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [imageIndices, setImageIndices] = useState({});

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await dispatch(logoutThunk());
    await persistor.purge();
    navigate("/login");
  };

  /* ================= DEBOUNCE ================= */
  useEffect(() => {
    clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => clearTimeout(debounceTimerRef.current);
  }, [searchQuery]);

  /* ================= FILTER + CACHE ================= */
  const filteredProducts = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return products;

    if (searchCacheRef.current.has(q)) {
      return searchCacheRef.current.get(q);
    }

    const result = products.filter(
      (p) =>
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );

    searchCacheRef.current.set(q, result);
    return result;
  }, [products, debouncedQuery]);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ownerItemService.getAllProducts();
        setProducts(res.data || []);

        const indices = {};
        (res.data || []).forEach((p) => (indices[p.ot_id] = 0));
        setImageIndices(indices);

        searchCacheRef.current.clear();
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

  /* ================= UI ================= */
  return (
    <div className="dashboard-page">
      {/* Animated background orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* ===== NAVBAR ===== */}
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand className="brand-logo" onClick={() => navigate("/customer/dashboard")}>
            <span className="brand-icon">⌂</span>
            Rent<span className="brand-accent">It</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="navbar-nav" />
          
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto nav-items">
              <Nav.Link 
                className="nav-link-custom" 
                onClick={() => navigate("/customer/dashboard")}
              >
                Home
              </Nav.Link>

              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  placeholder="Search appliances…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <span 
                    className="search-clear" 
                    onClick={() => setSearchQuery("")}
                  >
                    ✕
                  </span>
                )}
              </div>

              <Nav.Link 
                className="nav-link-custom cart-link" 
                onClick={() => navigate("/mycart")}
              >
                <span className="cart-icon">🛒</span>
                Cart
              </Nav.Link>

              <Button 
                variant="outline-primary" 
                className="logout-btn" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ===== HERO ===== */}
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
                  Browse Products
                </Button>
                <Button 
                  className="action-btn-secondary"
                  onClick={() => navigate("/mycart")}
                >
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

      {/* ===== PRODUCTS ===== */}
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
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
            </p>
          </motion.div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : "No products available at the moment."
                }
              </p>
            </motion.div>
          ) : (
            <Row className="g-4">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p, index) => {
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
                                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-medium)' }}>/day</span>
                              </div>
                            </div>

                            <div className="product-actions">
                              <div style={{ marginTop: "12px" }}>
  <button
    style={{
      padding: "10px 14px",
      background: "red",
      color: "white",
      border: "none",
      cursor: "pointer",
      position: "relative",
      zIndex: 9999
    }}
    onClick={() => {
      console.log("RAW BUTTON CLICKED", p.ot_id);
      alert("RAW BUTTON CLICKED");
      handleAddToCart(p.ot_id);
    }}
  >
    TEST ADD TO CART
  </button>
</div>


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

      {error && (
        <motion.div 
          className="error-toast"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default CustomerDashboard;