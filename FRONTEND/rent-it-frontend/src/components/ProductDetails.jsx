import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { ownerItemService, cartService } from '../services/api'; // ✅ Added cartService
import  "../assets/product-details.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartLoading, setCartLoading] = useState(false); // ✅ Add to Cart loading
  const [cartSuccess, setCartSuccess] = useState(false); // ✅ Success state

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await ownerItemService.getProductDetails(id);
      console.log(response.data);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add to Cart Handler
  const handleAddToCart = async () => {
    try {
      setCartLoading(true);
      await cartService.addToCart(id); // Same API as Dashboard
      setCartSuccess(true);
      
      // Auto-hide success after 3s
      setTimeout(() => {
        setCartSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Add to cart failed:', err);
      setError('Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted">Loading product details...</p>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger" className="mx-auto" style={{ maxWidth: '500px' }}>
          {error || 'Product not found'}
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate('/customer/dashboard')}>
          ← Back to Appliances
        </Button>
      </Container>
    );
  }

  const images = [
    product.img1Base64, product.img2Base64, product.img3Base64,
    product.img4Base64, product.img5Base64
  ].filter(img => img);

  return (
    <Container className="py-5">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate('/customer/dashboard')}
        className="mb-4 px-4"
      >
        ← Back to Appliances
      </Button>

      {cartSuccess && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setCartSuccess(false)}>
          ✅ Item added to cart successfully!
        </Alert>
      )}

      <Row className="g-5">
        {/* Images Section - SAME */}
        <Col md={6}>
          <div className="position-relative">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={product.brand}
                className="w-100 rounded-4 shadow-lg img-fluid cursor-pointer"
                style={{ height: '450px', objectFit: 'cover' }}
              />
            ) : (
              <div className="w-100 rounded-4 border d-flex align-items-center justify-content-center bg-light shadow" 
                   style={{ height: '450px' }}>
                <div className="text-center text-muted">
                  <i className="fas fa-image fa-4x mb-3 opacity-50"></i>
                  <p className="mb-0">No images available</p>
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* Product Details */}
        <Col md={6}>
          <Card className="border-0 shadow-xl h-100">
            <Card.Body className="p-5">
              <h1 className="fw-bold mb-4 display-5 text-dark">{product.brand}</h1>
              
              {/* Pricing Cards - SAME */}
              <div className="bg-gradient-success p-4 rounded-4 mb-5 text-white shadow">
                <Row className="g-4 align-items-center">
                  <Col xs={6}>
                    <div className="text-center">
                      <div className="h2 fw-bold mb-2">₹{product.rent_per_day}</div>
                      <div className="h6 opacity-90">PER DAY</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center">
                      <div className="h3 fw-bold mb-2">₹{product.deposit_amt}</div>
                      <div className="h6 opacity-90">DEPOSIT</div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Description - SAME */}
              <div className="mb-4">
                <h3 className="h4 fw-bold mb-3">Description</h3>
                <p className="lead fs-5 text-muted">{product.description}</p>
              </div>

              {/* Product Info - SAME */}
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <h6 className="fw-bold mb-2">Condition</h6>
                    <p className="mb-2">{product.condition_type}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <h6 className="fw-bold mb-2">Status</h6>
                    <Badge 
                      bg={product.status === 'AVAILABLE' ? 'success' : 'warning'} 
                      className="fs-6 px-3 py-2"
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <h6 className="fw-bold mb-2">Owner</h6>
                    <p className="mb-0 fw-semibold">{product.ownerName || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* ✅ UPDATED Action Buttons - Only Add to Cart */}
              <div className="d-grid gap-3">
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  className="py-3 fs-5 fw-bold border-3"
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.status !== 'AVAILABLE'}
                >
                  {cartLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Adding...
                    </>
                  ) : cartSuccess ? (
                    '✅ Added!'
                  ) : (
                    '🛒 Add to Cart'
                  )}
                </Button>
              </div>

              {/* Product ID - SAME */}
              <div className="mt-4 pt-4 border-top text-muted small">
                ot_id: {product.ot_id}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
