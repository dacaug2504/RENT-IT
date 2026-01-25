import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col, Spinner } from 'react-bootstrap';
import { ownerService } from '../services/api';

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemId: '',
    brand: '',
    description: '',
    conditionType: 'WORKING',
    rentPerDay: '',
    depositAmt: '',
  });
  
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch categories
    ownerService.getCategories()
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
    
    // Fetch all items
    ownerService.getAllItems()
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    
    if (categoryId) {
      ownerService.getItemsByCategory(parseInt(categoryId))
        .then(response => setFilteredItems(response.data))
        .catch(error => console.error('Error fetching items:', error));
    } else {
      setFilteredItems([]);
    }
    
    // Reset item selection
    setFormData({ ...formData, itemId: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'itemId' || name === 'rentPerDay' || name === 'depositAmt'
        ? (value ? parseInt(value) : '')
        : value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await ownerService.addItem(formData);
      setSuccess('Item added successfully! 🎉');
      
      // Reset form
      setFormData({
        itemId: '',
        brand: '',
        description: '',
        conditionType: 'WORKING',
        rentPerDay: '',
        depositAmt: '',
      });
      setSelectedCategory('');
      setFilteredItems([]);
      
      // Redirect to my items after 2 seconds
      setTimeout(() => {
        navigate('/owner/my-items');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--soft-white) 0%, var(--pastel-green-light) 100%)',
      padding: '40px 0'
    }}>
      <Container>
        <Card className="shadow-lg border-0" style={{ borderRadius: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h2 style={{ color: 'var(--text-dark)', fontWeight: '700', fontSize: '32px' }}>
                📦 Add New Item for Rent
              </h2>
              <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
                List your appliance and start earning
              </p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category *</Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        padding: '12px'
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.type}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Item Type *</Form.Label>
                    <Form.Select
                      name="itemId"
                      value={formData.itemId}
                      onChange={handleChange}
                      disabled={!selectedCategory}
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        padding: '12px'
                      }}
                    >
                      <option value="">Select Item</option>
                      {filteredItems.map(item => (
                        <option key={item.itemId} value={item.itemId}>
                          {item.itemName}
                        </option>
                      ))}
                    </Form.Select>
                    {!selectedCategory && (
                      <Form.Text className="text-muted">
                        Please select a category first
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Brand *</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g., LG, Samsung, Philips, WoodWorks"
                  maxLength={45}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    padding: '12px'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item (features, age, usage, etc.) - Max 80 characters"
                  maxLength={80}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    padding: '12px'
                  }}
                />
                <Form.Text className="text-muted">
                  {formData.description.length}/80 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Condition *</Form.Label>
                <Form.Select
                  name="conditionType"
                  value={formData.conditionType}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    padding: '12px'
                  }}
                >
                  <option value="WORKING">Working Perfectly</option>
                  <option value="NEED_TO_BE_REPAIRED">Needs Repair</option>
                  <option value="EXCELLENT">Excellent Condition</option>
                  <option value="GOOD">Good Condition</option>
                  <option value="FAIR">Fair Condition</option>
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rent Per Day (₹) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="rentPerDay"
                      value={formData.rentPerDay}
                      onChange={handleChange}
                      placeholder="Enter daily rent amount"
                      min="1"
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        padding: '12px'
                      }}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Security Deposit (₹) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="depositAmt"
                      value={formData.depositAmt}
                      onChange={handleChange}
                      placeholder="Enter deposit amount"
                      min="0"
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        padding: '12px'
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div 
                style={{ 
                  background: 'var(--pastel-green-light)', 
                  padding: '20px', 
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}
              >
                <h5 style={{ color: 'var(--text-dark)', marginBottom: '10px' }}>
                  💡 Pricing Tips
                </h5>
                <ul style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: 0 }}>
                  <li>Check similar items in your area for competitive pricing</li>
                  <li>Higher deposits protect your items better</li>
                  <li>Reasonable prices attract more renters</li>
                </ul>
              </div>

              <div className="d-grid gap-2 mt-4">
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, var(--pastel-green) 0%, var(--pastel-green-dark) 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Adding Item...
                    </>
                  ) : (
                    '✓ Add Item for Rent'
                  )}
                </Button>
                
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/owner/dashboard')}
                  style={{
                    borderRadius: '12px',
                    padding: '12px',
                    fontWeight: '600'
                  }}
                >
                  ← Back to Dashboard
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AddItem;