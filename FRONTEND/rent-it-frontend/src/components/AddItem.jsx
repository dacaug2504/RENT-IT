import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import { Container, Form, Button, Alert, Card, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { ownerService } from '../services/api';
import { useRef } from 'react';
import SuccessScreen from "../components/SuccessScreen";
import { useDispatch } from "react-redux";
import { forceLogout } from "../features/auth/authSlice";
import { persistor } from "../app/store";




const AddItem = () => {
  const navigate = useNavigate();
  const submitLock = useRef(false);
  const dispatch = useDispatch();


  const [formData, setFormData] = useState({
    categoryId: '',
    itemId: '',
    brand: '',
    description: '',
    conditionType: '',
    rentPerDay: '',
    depositAmt: '',
    maxRentDays: '',
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
  const [showSuccess, setShowSuccess] = useState(false);



  /* =========================
     LOAD CATEGORIES ON PAGE LOAD
     ========================= */
  useEffect(() => {
    ownerService.getCategories()
      .then(res => {
        console.log('CATEGORIES JSON ', res.data);
        setCategories(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load categories');
      });
  }, []);

  const categoryOptions = categories.map(cat => ({
    value: cat.categoryId,
    label: cat.categoryName
  }));

  const itemOptions = filteredItems.map(item => ({
    value: item.itemId,
    label: item.itemName
  }));


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
     LOGOUT HANDLER
     ========================= */

const handleLogout = async () => {
  dispatch(forceLogout());
  await persistor.purge();
  localStorage.removeItem("token");
  navigate("/search       ", { replace: true });
};



  /* =========================
     INPUT CHANGE HANDLER
     ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: ['itemId', 'rentPerDay', 'depositAmt', 'maxRentDays'].includes(name)
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

    if (!formData.maxRentDays || formData.maxRentDays <= 0) {
      setError('Max rent days must be greater than 0');
      submitLock.current = false;
      setLoading(false);
      return;
    }


    setLoading(true);
    setError('');
    setSuccess('');

    const images = {};
    imageSlots.forEach(slot => {
      if (slot.file) images[slot.key] = slot.file;
    });

    try {
      
        await ownerService.addItem(formData, images);

        // SHOW FULL-SCREEN SUCCESS OVERLAY
        setShowSuccess(true);

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
    <>
    {showSuccess && (
      <SuccessScreen
        title="Product Added Successfully ✅"
        message="Your product is now visible in My Listings"
        redirectTo="/owner/my-products"
      />
    )}

    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--soft-white) 0%, var(--pastel-green-light) 100%)'
      }}
    >


      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="navbar">
        <Container>
          <Navbar.Brand
            style={{ fontWeight: '700', fontSize: '24px', color: 'var(--text-dark)' }}
          >
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

              <Nav.Link
                onClick={() => navigate('/owner/add-product')}
                style={{ color: 'var(--pastel-green-dark) !important' }}
              >
                Add Product
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

                  <Select
                    classNamePrefix="react-select"
                    placeholder="Select Category"
                    options={categoryOptions}
                    onChange={(option) => handleCategoryChange({
                      target: { value: option.value }
                    })}
                  />

                </Form.Group>

                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Item *</Form.Label>
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Select Item"
                      options={itemOptions}
                      isDisabled={!selectedCategory}
                      onChange={(option) =>
                        setFormData(prev => ({
                          ...prev,
                          itemId: option.value
                        }))
                      }
                    />

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
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rent Per Day (₹) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="rentPerDay"
                      placeholder="e.g. 150"
                      value={formData.rentPerDay}
                      onChange={handleChange}
                      min={1}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Security Deposit (₹) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="depositAmt"
                      placeholder="e.g. 2000"
                      value={formData.depositAmt}
                      onChange={handleChange}
                      min={0}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Rent Days *</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxRentDays"
                      placeholder="e.g. 30"
                      value={formData.maxRentDays}
                      onChange={handleChange}
                      min={1}
                      max={365}
                      required
                    />
                    <Form.Text muted>
                      Maximum number of days this item can be rented
                    </Form.Text>
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
    </>
  );
};

export default AddItem;
