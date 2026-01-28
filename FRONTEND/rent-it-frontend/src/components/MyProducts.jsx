import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Button, Spinner, Alert, Navbar, Nav } from 'react-bootstrap';
import { ownerService, userService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';


const MyProducts = () => {
  const navigate = useNavigate();
  const user = userService.getCurrentUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const response = await ownerService.getMyProducts();
      setItems(response.data);
    } catch (err) {
      setError('Failed to load items');
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
      'WORKING': { bg: 'success', text: '✓ Working' },
      'NEED_TO_BE_REPAIRED': { bg: 'warning', text: '⚠ Needs Repair' },
      'EXCELLENT': { bg: 'primary', text: '⭐ Excellent' },
      'GOOD': { bg: 'info', text: '👍 Good' },
      'FAIR': { bg: 'secondary', text: 'Fair' }
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

      // Remove item from UI immediately (no refetch needed)
      setItems(prev => prev.filter(item => item.otId !== otId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };


  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" style={{ color: 'var(--pastel-green-dark)' }} />
        <p className="mt-3">Loading your items...</p>
      </Container>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--soft-white) 0%, var(--pastel-green-light) 100%)'
    }}>
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="navbar">
        <Container>
          <Navbar.Brand style={{ fontWeight: '700', fontSize: '24px', color: 'var(--text-dark)' }}>
            🏠 Rent-It System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate('/owner/dashboard')}>Dashboard</Nav.Link>
              <Nav.Link onClick={() => navigate('/owner/my-products')} style={{ color: 'var(--pastel-green-dark) !important' }}>
                My Listings
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
            <h2 style={{ color: 'var(--text-dark)', fontWeight: '700' }}>
              📦 My Listed Items
            </h2>
            <p style={{ color: 'var(--text-light)' }}>
              Manage your rental listings
            </p>
          </div>
          <Button 
            variant="primary"
            onClick={() => navigate('/owner/add-product')}
            style={{
              background: 'linear-gradient(135deg, var(--pastel-green) 0%, var(--pastel-green-dark) 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: '600'
            }}
          >
            + Add New Product
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {items.length === 0 ? (
          <Card className="text-center p-5" style={{ borderRadius: '20px', border: '2px dashed var(--border-color)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
            <h4 style={{ color: 'var(--text-dark)' }}>No Items Listed Yet</h4>
            <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
              Start listing your appliances to earn money!
            </p>
            <Button 
              variant="primary"
              onClick={() => navigate('/owner/add-item')}
              style={{
                background: 'linear-gradient(135deg, var(--pastel-green) 0%, var(--pastel-green-dark) 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 32px',
                fontWeight: '600'
              }}
            >
              Add Your First Item
            </Button>
          </Card>
        ) : (
          <AnimatePresence>
          <Row>
            {items.map(item => {
              const conditionBadge = getConditionBadge(item.conditionType);
              return (
                <motion.div
                  key={item.otId}
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


                  <Card className="h-100 shadow-sm" style={{ borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 style={{ color: 'var(--text-dark)', fontWeight: '600', marginBottom: '5px' }}>
                          {item.item.itemName}
                        </h5>
                        <Badge 
                          bg={item.status === 'AVAILABLE' ? 'success' : 'secondary'}
                          style={{ borderRadius: '20px', padding: '6px 12px' }}
                        >
                          {item.status === 'AVAILABLE' ? '✓ Available' : '✗ Not Available'}
                        </Badge>
                        
                      </div>
                      
                      <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Brand:</strong> {item.brand}
                      </p>
                      
                      <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Category:</strong> {item.item.category?.type || 'N/A'}
                      </p>
                      
                      <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '15px' }}>
                        {item.description}
                      </p>
                      
                      <div style={{ 
                        background: 'var(--pastel-green-light)', 
                        padding: '15px', 
                        borderRadius: '12px',
                        marginBottom: '15px'
                      }}>
                        <div className="d-flex justify-content-between mb-2">
                          <span style={{ color: 'var(--text-dark)', fontWeight: '600' }}>Rent/Day:</span>
                          <span style={{ color: 'var(--pastel-green-dark)', fontWeight: '700', fontSize: '18px' }}>
                            ₹{item.rentPerDay}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span style={{ color: 'var(--text-dark)', fontWeight: '600' }}>Deposit:</span>
                          <span style={{ color: 'var(--text-dark)', fontWeight: '600' }}>
                            ₹{item.depositAmt}
                          </span>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <Badge 
                          bg={conditionBadge.bg}
                          style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '12px' }}
                        >
                          {conditionBadge.text}
                        </Badge>

                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleEdit(item.otId)}
                            style={{ borderRadius: '8px' }}
                          >
                            ✏️ Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(item.otId)}
                            style={{ borderRadius: '8px' }}
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
