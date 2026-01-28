import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
import { userService } from '../services/api';

import EditProductDetails from './EditProductDetails';
import EditProductImages from './EditProductImages';


const EditProduct = () => {
  const { otId } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    userService.logout();
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/owner/my-products');
  };


  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--soft-white) 0%, var(--pastel-green-light) 100%)'
      }}
    >
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="navbar">
        <Container>
          <Navbar.Brand style={{ fontWeight: '700', fontSize: '24px', color: 'var(--text-dark)' }}>
            🏠 Rent-It System
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate('/owner/dashboard')}>
                Dashboard
              </Nav.Link>

              <Nav.Link onClick={() => navigate('/owner/my-products')}>
                My Listings
              </Nav.Link>

              <Nav.Link style={{ color: 'var(--pastel-green-dark) !important' }}>
                Edit Product
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
        <Card className="p-4 shadow">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleBack}
              style={{ borderRadius: '8px' }}
            >
              ⬅ Back
            </Button>

            <h3 className="mb-0 text-center flex-grow-1">
              ✏️ Edit Product (ID: {otId})
            </h3>

            {/* spacer to keep title centered */}
            <div style={{ width: '70px' }} />
          </div>


          <Row className="g-4">
            <Col md={6}>
              <Card className="h-100 p-3 border-0 shadow-sm">
                <h5 className="mb-3">📝 Edit Details</h5>
                <EditProductDetails otId={otId} />
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 p-3 border-0 shadow-sm">
                <h5 className="mb-3">🖼️ Edit Images</h5>
                <EditProductImages otId={otId} />
              </Card>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default EditProduct;
