import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col, Spinner } from 'react-bootstrap';
import { ownerService } from '../services/api';
import { useRef } from 'react';

const AddItem = () => {
  const navigate = useNavigate();
  const submitLock = useRef(false);

  const [formData, setFormData] = useState({
    categoryId: '',
    itemId: '',
    brand: '',
    description: '',
    conditionType: '',
    rentPerDay: '',
    depositAmt: '',
  });

  const [imageSlots, setImageSlots] = useState([
  { key: 'img1', file: null, preview: null },
  { key: 'img2', file: null, preview: null },
  { key: 'img3', file: null, preview: null },
]);



  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD CATEGORIES ON PAGE LOAD
     ========================= */
  useEffect(() => {
    ownerService.getCategories()
      .then(res => {
        console.log('CATEGORIES JSON 👉', res.data);
        setCategories(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load categories');
      });
  }, []);

  /* =========================
     CATEGORY CHANGE HANDLER
     ========================= */
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    setSelectedCategory(categoryId);

    setFormData(prev => ({
      ...prev,
      categoryId: Number(categoryId),
      itemId: ''
    }));

    if (!categoryId) {
      setFilteredItems([]);
      return;
    }

    ownerService.getItemsByCategory(Number(categoryId))
      .then(res => setFilteredItems(res.data))
      .catch(err => {
        console.error(err);
        setError('Failed to load items for selected category');
      });
  };


  /* =========================
     INPUT CHANGE HANDLER
     ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: ['itemId', 'rentPerDay', 'depositAmt'].includes(name)
        ? (value ? Number(value) : '')
        : value,
    }));

    setError('');
    setSuccess('');
  };

  /* =========================
     FORM SUBMIT
     ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitLock.current) return; // 🔥 HARD STOP
    submitLock.current = true;

    setLoading(true);
    setError('');
    setSuccess('');

    const images = {};
    imageSlots.forEach(slot => {
      if (slot.file) images[slot.key] = slot.file;
    });

    try {
      await ownerService.addItem(formData, images);
      setSuccess('Product added successfully! 🎉');
    } catch (err) {
      console.error(err);
      setError('Failed to add Product');
    } finally {
      setLoading(false);
      submitLock.current = false;
    }
  };





  /* =========================
      image change HANDLER
     ========================= */
  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageSlots(prev =>
      prev.map(slot =>
        slot.key === key
          ? {
              ...slot,
              file,
              preview: URL.createObjectURL(file),
            }
          : slot
      )
    );
  };



  return (
    <div style={{ minHeight: '100vh', padding: '40px 0' }}>
      <Container>
        <Card className="shadow-lg border-0" style={{ borderRadius: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <Card.Body className="p-5">

            <h2 className="text-center mb-3">📦 Add New Item for Rent</h2>

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
                  >

                    <option value="" disabled>
                      Select Category
                    </option>

                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Item *</Form.Label>
                    <Form.Select
                      name="itemId"
                      value={formData.itemId}
                      onChange={handleChange}
                      disabled={!selectedCategory}
                      required
                    >
                      <option value="">Select Item</option>
                      {filteredItems.map(item => (
                        <option key={item.itemId} value={item.itemId}>
                          {item.itemName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Brand *</Form.Label>
                <Form.Control
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
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
                  maxLength={80}
                  required
                />
                <small>{formData.description.length}/80</small>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Condition *</Form.Label>
                <Form.Control
                  type="text"
                  name="conditionType"
                  value={formData.conditionType}
                  onChange={handleChange}
                  placeholder="e.g. Working, Excellent, Slightly Used"
                  maxLength={50}
                  required
                  style={{
                    color: '#2d3e3f',
                    backgroundColor: '#ffffff'
                  }}
                />
                <Form.Text muted>
                  Max 50 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Product Images (optional)</Form.Label>

                <Row className="g-4 mb-3">
                  {imageSlots.map((slot) => (
                    <Col md={4} key={slot.key}>
                      <Card className="h-100 shadow-sm">
                        {slot.preview ? (
                          <Card.Img
                            variant="top"
                            src={slot.preview}
                            style={{ height: '180px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              height: '180px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f8f9fa',
                              color: '#999',
                              fontSize: '14px'
                            }}
                          >
                            No Image
                          </div>
                        )}

                        <Card.Body>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, slot.key)}
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>




                <Form.Text muted>
                  You can upload up to 3 images(You can add more images later from Edit Product)
                </Form.Text>
              </Form.Group>

              




              <Row className="mt-2">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rent Per Day (₹) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="rentPerDay"
                      placeholder="e.g. 150"
                      value={formData.rentPerDay}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Security Deposit (₹) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="depositAmt"
                      placeholder="e.g. 2000"
                      value={formData.depositAmt}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>


              <Button className="mt-4 w-100" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Item'}
              </Button>
            </Form>

          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AddItem;
