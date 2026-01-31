import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Row,
  Badge,
  Button,
  Spinner,
  Alert,
  Navbar,
  Nav
} from 'react-bootstrap';
import { ownerService, userService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const MyProducts = () => {
  const navigate = useNavigate();
  const user = userService.getCurrentUser();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await ownerService.getMyProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    userService.logout();
    navigate('/login');
  };

  const getConditionBadge = (condition) => {
    const badges = {
      WORKING: { bg: 'success', text: '✓ Working' },
      NEED_TO_BE_REPAIRED: { bg: 'warning', text: '⚠ Needs Repair' },
      EXCELLENT: { bg: 'primary', text: '⭐ Excellent' },
      GOOD: { bg: 'info', text: '👍 Good' },
      FAIR: { bg: 'secondary', text: 'Fair' }
    };
    return badges[condition] || { bg: 'secondary', text: condition };
  };

  const handleEdit = (otId) => {
    navigate(`/owner/edit-product/${otId}`);
  };

  const handleDelete = async (otId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await ownerService.deleteProduct(otId);
      setProducts(prev => prev.filter(product => product.otId !== otId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading your products...</p>
      </Container>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, var(--soft-white) 0%, var(--pastel-green-light) 100%)'
      }}
    >
      {/* Navbar */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand style={{ fontWeight: '700', fontSize: '24px' }}>
            🏠 Rent-It System
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate('/owner/dashboard')}>
                Dashboard
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate('/owner/my-products')}
                style={{ color: 'var(--pastel-green-dark)' }}
              >
                My Products
              </Nav.Link>
              <Button
                variant="outline-primary"
                onClick={handleLogout}
                className="ms-2"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 style={{ fontWeight: '700' }}>📦 My Products</h2>
            <p>Manage your rental products</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/owner/add-product')}
          >
            + Add New Product
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {products.length === 0 ? (
          <Card className="text-center p-5">
            <div style={{ fontSize: '64px' }}>📦</div>
            <h4>No Products Listed Yet</h4>
            <p>Start listing your appliances to earn money!</p>
            <Button onClick={() => navigate('/owner/add-product')}>
              Add Your First Product
            </Button>
          </Card>
        ) : (
          <AnimatePresence>
            <Row>
              {products.map(product => {
                const conditionBadge = getConditionBadge(
                  product.conditionType
                );

                return (
                  <motion.div
                    key={product.otId}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{
                      opacity: { duration: 0.5, ease: 'easeInOut' },
                      y: { duration: 0.5, ease: 'easeInOut' },
                      layout: {
                        type: 'spring',
                        stiffness: 60,
                        damping: 20
                      }
                      
                      // layout: {
                      //   type: 'spring',
                      //   stiffness: 80,
                      //   damping: 18
                      // }
                      // layout: {
                      //   type: 'spring',
                      //   stiffness: 120,
                      //   damping: 15
                      // }
                    }}
                    className="col-md-6 col-lg-4 mb-4"
                  >

                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-3">
                          <h5>{product.item.itemName}</h5>
                          <Badge
                            bg={
                              product.status === 'AVAILABLE'
                                ? 'success'
                                : 'secondary'
                            }
                          >
                            {product.status === 'AVAILABLE'
                              ? '✓ Available'
                              : '✗ Not Available'}
                          </Badge>
                        </div>

                        <p><strong>Brand:</strong> {product.brand}</p>
                        <p>
                          <strong>Category:</strong>{' '}
                          {product.item.category?.type || 'N/A'}
                        </p>
                        <p>{product.description}</p>

                        <div className="mb-3">
                          <strong>Rent/Day:</strong> ₹{product.rentPerDay}
                          <br />
                          <strong>Deposit:</strong> ₹{product.depositAmt}
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                          {/* <Badge 
                            bg={conditionBadge.bg}
                            style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '12px' }}
                          >
                            {conditionBadge.text}
                          </Badge> */}
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              color: 'var(--text-dark)',
                              fontWeight: '500'
                            }}
                          >
                            <strong>Condition:</strong>{' '}
                            {product.conditionType
                              ?.replaceAll('_', ' ')
                              .toLowerCase()
                              .replace(/\b\w/g, c => c.toUpperCase())}
                          </p>



                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleEdit(product.otId)}
                            >
                              ✏️ Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="outline-danger"
                              disabled={product.status === 'UNAVAILABLE'}
                              onClick={() =>
                                handleDelete(product.otId)
                              }
                              title={
                                product.status === 'UNAVAILABLE'
                                  ? 'Product is currently rented'
                                  : 'Delete product'
                              }
                            >
                              🗑 Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                );
              })}
            </Row>
          </AnimatePresence>
        )}
      </Container>
    </div>
  );
};

export default MyProducts;
