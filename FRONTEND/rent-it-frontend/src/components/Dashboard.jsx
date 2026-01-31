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
  Alert,
} from "react-bootstrap";
import { userService, cartService, ownerItemService } from "../services/api";

const Dashboard = ({ role }) => {
  const navigate = useNavigate();
  const user = userService.getCurrentUser();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartSuccess, setCartSuccess] = useState(null);

  let roleName = null;

  if (typeof user?.role === "object" && user.role !== null) {
    roleName = user.role.roleName || user.role.role_name;
  } else {
    roleName = user?.role;
  }

  roleName = roleName?.toUpperCase();

  const handleLogout = () => {
    userService.logout();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const displayName = user.first_name || user.firstName || "User";

  const getRoleDescription = () => {
    switch (role) {
      case "customer":
        return "Browse and rent reliable home appliances from nearby owners.";
      case "owner":
        return "List your appliances, manage requests, and grow your rental income.";
      case "admin":
        return "Oversee users, listings, and keep the platform running smoothly.";
      default:
        return "Welcome to Rent-It System.";
    }
  };

  useEffect(() => {
    if (role !== "customer") return;

    const fetchProducts = async () => {
      try {
        const response = await ownerItemService.getAllProducts();
        setProducts(response.data || []);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("You are not authorized to view products.");
        } else {
          setError("Failed to load products. Please try again.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [role]);

  const handleAddToCart = async (ownerItemId) => {
    try {
      await cartService.addToCart(ownerItemId);
      setCartSuccess(ownerItemId);
      setTimeout(() => setCartSuccess(null), 3000);
    } catch (err) {
      setError("Failed to add to cart. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Top Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm sticky-top dashboard-navbar">
        <Container>
          <Navbar.Brand className="fw-bold text-primary">
            🏠 Rent-It
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Home
              </Nav.Link>

              {role === "customer" && (
                <>
                  <Nav.Link href="#appl">Browse Appliances</Nav.Link>
                  <Nav.Link href="#rentals">My Rentals</Nav.Link>
                  <Nav.Link onClick={() => navigate("/mycart")}>
                    🛒 My Cart
                  </Nav.Link>
                </>
              )}

              {role === "owner" && (
                <>
                  <Nav.Link href="#listings">My Listings</Nav.Link>
                  <Nav.Link onClick={() => navigate("/dev/add-item")}>
                    Add Appliances
                  </Nav.Link>
                  <Nav.Link href="#requests">Rental Requests</Nav.Link>
                </>
              )}

              {role === "admin" && (
                <>
                  <Nav.Link href="#users">Manage Users</Nav.Link>
                  <Nav.Link href="#listings">All Listings</Nav.Link>
                  <Nav.Link href="#reports">Reports</Nav.Link>
                </>
              )}

              <Button
                variant="outline-primary"
                onClick={handleLogout}
                className="ms-3"
                size="sm"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero / Welcome Section */}
      <section className="dashboard-hero">
        <Container>
          <div className="hero-card">
            <div>
              <div className="hero-badge">
                {roleName} ACCOUNT
              </div>
              <h1 className="hero-title">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="hero-subtitle">{getRoleDescription()}</p>

              {role === "customer" && (
                <div className="hero-actions">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() =>
                      document
                        .getElementById("appl")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Browse Appliances
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => navigate("/mycart")}
                  >
                    View My Cart
                  </Button>
                </div>
              )}
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <span className="stat-label">Role</span>
                <span className="stat-value">{roleName}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Status</span>
                <span className="stat-value text-success">Active</span>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          {cartSuccess && (
            <Alert
              variant="success"
              onClose={() => setCartSuccess(null)}
              dismissible
              className="mt-3"
            >
              Item added to cart!
            </Alert>
          )}
        </Container>
      </section>

      {/* Products Section */}
      {role === "customer" && (
        <section className="dashboard-products" id="appl">
          <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="section-title">All Appliances</h2>
                <p className="section-subtitle">
                  Choose from a curated list of home appliances available for rent.
                </p>
              </div>
            </div>

            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No products available.</p>
            ) : (
              <Row xs={2} sm={2} md={3} lg={4} className="g-4">
                {products.map((product) => (
                  <Col key={product.ot_id}>
                    <Card
                      className="product-card h-100"
                      onClick={() => navigate(`/product/${product.ot_id}`)}
                    >
                      {/* Placeholder image / banner area */}
                      <div className="product-image-placeholder">
                        <span className="product-image-text">
                          {product.brand?.[0] || "A"}
                        </span>
                      </div>

                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="product-title mb-2">
                          {product.brand}
                        </Card.Title>
                        <Card.Text className="product-description mb-3">
                          {product.description
                            ? product.description.substring(0, 80) + "..."
                            : "No description available."}
                        </Card.Text>

                        <div className="mb-3">
                          <div className="product-price">
                            ₹{product.rent_per_day}/day
                          </div>
                          <div className="product-deposit">
                            Deposit: ₹{product.deposit_amt}
                          </div>
                        </div>

                        <div className="mt-auto d-grid gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            // className="btn-xs-mobile"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product.ot_id);
                            }}
                            disabled={cartSuccess === product.ot_id}
                          >
                            {cartSuccess === product.ot_id
                              ? "Added!"
                              : "🛒 Add to Cart"}
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${product.ot_id}`);
                            }}
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
      )}
    </div>
  );
};

export default Dashboard;
