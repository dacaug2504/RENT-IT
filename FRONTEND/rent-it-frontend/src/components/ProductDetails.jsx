import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { ownerItemService, cartService } from '../services/api';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleAddToCart = async () => {
    try {
      setCartLoading(true);
      await cartService.addToCart(id);
      setCartSuccess(true);
      
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

  // Move images definition here, before it's used
  const images = product ? [
    product.img1Base64, 
    product.img2Base64, 
    product.img3Base64,
    product.img4Base64, 
    product.img5Base64
  ].filter(img => img) : [];

  const handleNextImage = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrevImage = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleThumbnailClick = (index) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
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

  return (
    <>
      <style>{`
        .carousel-main-image {
          transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        }
        
        .carousel-main-image.transitioning {
          opacity: 0;
          transform: scale(0.98);
        }
        
        .thumbnail-container {
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid transparent;
          overflow: hidden;
        }
        
        .thumbnail-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
        
        .thumbnail-container.active {
          border-color: #0d6efd;
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }
        
        .thumbnail-image {
          transition: transform 0.3s ease;
        }
        
        .thumbnail-container:hover .thumbnail-image {
          transform: scale(1.1);
        }
        
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10;
        }
        
        .carousel-arrow:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        .carousel-arrow:active {
          transform: translateY(-50%) scale(0.95);
        }
        
        .carousel-arrow.left {
          left: 20px;
          color: #0d6efd;
        }
        
        .carousel-arrow.right {
          right: 20px;
          color: #0d6efd;
        }
        
        .carousel-arrow i {
          font-size: 20px;
          color: #000000;
        }
        
        .product-card {
          border-radius: 20px;
          border: none;
          transition: transform 0.3s ease;
        }
        
        .info-box {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .info-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .pricing-card {
          background: linear-gradient(135deg, #5fdaa3 0%);
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(13, 110, 253, 0.3);
        }
        
        .add-to-cart-btn {
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
        }
        
        .add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 110, 253, 0.3);
        }
        
        .product-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #212529 0%, #495057 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .no-image-placeholder {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
      `}</style>

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
          {/* Images Section with Carousel */}
          <Col md={6}>
            <div className="position-relative mb-3">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={`${product.brand} - Image ${currentImageIndex + 1}`}
                    className={`w-100 rounded-4 shadow-lg img-fluid carousel-main-image ${isTransitioning ? 'transitioning' : ''}`}
                    style={{ 
                      height: '450px', 
                      objectFit: 'contain',
                      userSelect: 'none'
                    }}
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button 
                        className="carousel-arrow left"
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      
                      <button 
                        className="carousel-arrow right"
                        onClick={handleNextImage}
                        aria-label="Next image"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>

                      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                        <Badge bg="dark" className="px-3 py-2 fs-6 opacity-75">
                          {currentImageIndex + 1} / {images.length}
                        </Badge>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-100 rounded-4 border d-flex align-items-center justify-content-center no-image-placeholder shadow" 
                     style={{ height: '450px' }}>
                  <div className="text-center text-muted">
                    <i className="fas fa-image fa-4x mb-3 opacity-50"></i>
                    <p className="mb-0 fw-semibold">No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Preview */}
            {images.length > 1 && (
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail-container rounded-3 ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                    style={{ 
                      width: '80px', 
                      height: '80px',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="thumbnail-image w-100 h-100 rounded-3"
                      style={{ 
                        objectFit: 'cover',
                        userSelect: 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Col>

          {/* Product Details */}
          <Col md={6}>
            <Card className="product-card shadow-xl h-100">
              <Card.Body className="p-5">
                <h1 className="product-title mb-4">{product.brand}</h1>
                
                {/* Pricing Card */}
                <div className="pricing-card p-4 mb-5 text-white">
                  <Row className="g-4 align-items-center">
                    <Col xs={6}>
                      <div className="text-center">
                        <div className="h2 fw-bold mb-2">₹{product.rent_per_day}</div>
                        <div className="h6 opacity-90 text-uppercase fw-semibold">Per Day</div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-center border-start border-white border-opacity-25">
                        <div className="h3 fw-bold mb-2">₹{product.deposit_amt}</div>
                        <div className="h6 opacity-90 text-uppercase fw-semibold">Deposit</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h3 className="h4 fw-bold mb-3 text-dark">
                    <i className="fas fa-align-left me-2 text-primary"></i>
                    Description
                  </h3>
                  <p className="lead fs-5 text-muted lh-base">{product.description}</p>
                </div>

                {/* Product Info Grid */}
                <div className="row g-3 mb-5">
                  <div className="col-md-6">
                    <div className="info-box p-4">
                      <h6 className="fw-bold mb-2 text-uppercase small text-muted">
                        <i className="fas fa-star me-2"></i>Condition
                      </h6>
                      <p className="mb-0 h5 fw-semibold text-dark">{product.condition_type}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-box p-4">
                      <h6 className="fw-bold mb-2 text-uppercase small text-muted">
                        <i className="fas fa-check-circle me-2"></i>Status
                      </h6>
                      <Badge 
                        bg={product.status === 'AVAILABLE' ? 'success' : 'warning'} 
                        className="fs-6 px-3 py-2"
                      >
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="info-box p-4">
                      <h6 className="fw-bold mb-2 text-uppercase small text-muted">
                        <i className="fas fa-user me-2"></i>Owner
                      </h6>
                      <p className="mb-0 h5 fw-semibold text-dark">{product.ownerName || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {/* <div className="d-grid gap-3">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="add-to-cart-btn py-3 fs-5 fw-bold"
                    onClick={handleAddToCart}
                    disabled={cartLoading || product.status !== 'AVAILABLE'}
                  >
                    {cartLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Adding to Cart...
                      </>
                    ) : cartSuccess ? (
                      <>
                        <i className="fas fa-check-circle me-2"></i>
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-shopping-cart me-2"></i>
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div> */}
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <button
                    style={{
                      padding: "14px 20px",
                      backgroundColor: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "600",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 99999
                    }}
                    onClick={() => {
                      console.log("RAW PRODUCT DETAILS ADD CLICKED", product.ot_id);
                      alert("RAW PRODUCT DETAILS ADD CLICKED");
                      handleAddToCart();
                    }}
                  >
                    🧪 TEST ADD TO CART (RAW)
                  </button>
                </div>


                {/* Product ID Footer */}
                <div className="mt-4 pt-4 border-top">
                  <div className="d-flex align-items-center justify-content-between text-muted small">
                    <span>
                      <i className="fas fa-tag me-2"></i>
                      <strong>Product ID:</strong> {product.ot_id}
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetails;