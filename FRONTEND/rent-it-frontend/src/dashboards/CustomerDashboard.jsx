import { useEffect, useState } from "react";
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
import "../assets/customer-dashboard.css";

import { userService, cartService, ownerItemService } from "../services/api";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartSuccess, setCartSuccess] = useState(null);

  const displayName = "Priya";

  const handleLogout = () => {
    userService.logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ============================
      FETCH PRODUCTS
     ============================ */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ownerItemService.getAllProducts();
        setProducts(res.data || []);
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
      ADD TO CART
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

  return (
    <div className="dashboard-page">
      {/* ================= NAVBAR ================= */}
      <Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
        <Container>
          <Navbar.Brand className="fw-bold text-primary">
            🏠 Rent-It
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate("/customer/dashboard")}>
                Home
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/mycart")}>
                🛒 My Cart
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

      {/* ================= HERO ================= */}
      <section className="dashboard-hero">
        <Container>
          <div className="hero-card">
            <div className="hero-content">
              <div className="hero-badge">CUSTOMER ACCOUNT</div>
              <h1 className="hero-title">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="hero-subtitle">
                Browse and rent reliable home appliances from nearby owners.
              </p>

              <div className="hero-actions">
                <Button
                  variant="success"
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
                  variant="outline-secondary"
                  className="action-btn-secondary"
                  onClick={() => navigate("/mycart")}
                >
                  View My Cart
                </Button>
              </div>
            </div>

            <div className="hero-stats">
              <div className="stat-card">
                <span className="stat-label">ROLE</span>
                <span className="stat-value">CUSTOMER</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">STATUS</span>
                <span className="stat-value status-active">Active</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="dashboard-products" id="appliances-section">
        <Container>
          <div className="products-header">
            <h2 className="products-title">All Appliances</h2>
            <p className="products-subtitle">
              Choose from a curated list of home appliances available for rent.
            </p>
          </div>

          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">No products found</div>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {products.map((p) => (
                <Col key={p.ot_id}>
                  <Card className="product-card">
                    <div className="product-image">
                      <div className="product-initial">
                        {p.brand ? p.brand.charAt(0).toUpperCase() : "A"}
                      </div>
                    </div>
                    <Card.Body className="product-body">
                      <h5 className="product-name">{p.brand}</h5>
                      <p className="product-description">
                        {p.description || "Comfortable appliance..."}
                      </p>

                      <div className="product-pricing">
                        <span className="product-price">₹{p.rent_per_day}/day</span>
                        <span className="product-deposit">Deposit: ₹{p.deposit_amt}</span>
                      </div>

                      <div className="product-actions">
                        <Button
                          variant="outline-secondary"
                          className="btn-add-cart"
                          onClick={() => handleAddToCart(p.ot_id)}
                          disabled={cartSuccess === p.ot_id}
                        >
                          🛒 {cartSuccess === p.ot_id ? "Added to Cart" : "Add to Cart"}
                        </Button>

                        <Button
                          variant="success"
                          className="btn-details"
                          onClick={() => navigate(`/product/${p.ot_id}`)}
                        >
                          View Details
                        </Button>

                      </div>
                    </Card.Body>
                  </Card>
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
