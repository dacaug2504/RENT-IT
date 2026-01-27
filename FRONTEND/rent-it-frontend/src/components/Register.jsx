import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { authService, userService } from '../services/api';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNo: '',
    address: '',
    state: '',
    city: '',
    roleId: ''
  });

  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  /* =======================
     VALIDATIONS
     ======================= */
  const isValidFirstName = (name) => name.trim().length >= 3;

  const isValidLastName = (name) =>
    name.trim() === '' || name.trim().length >= 2;

  const isValidGmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const isValidPhone = (phone) =>
    /^[6-9]\d{9}$/.test(phone);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      console.log('Fetching states from: http://localhost:8081/states');
      const response = await axios.get('http://localhost:8081/states');
      console.log('States response:', response.data);
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
      setGeneralError('Failed to load states. Please refresh the page.');
    }
  };

  const fetchCitiesByState = async (stateId) => {
    try {
      console.log('Fetching cities for state:', stateId);
      const response = await axios.get(`http://localhost:8081/cities/${stateId}`);
      console.log('Cities response:', response.data);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setGeneralError('Failed to load cities. Please try again.');
    }
  };

  const handleStateChange = async (e) => {
    const stateId = Number(e.target.value);

    // update form state
    setFormData(prev => ({
      ...prev,
      state: stateId,
      city: ''
    }));

    // side-effect: fetch cities
    if (stateId) {
      await fetchCitiesByState(stateId);
    } else {
      setCities([]);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    setFieldErrors({
      ...fieldErrors,
      [name]: ''
    });
    setGeneralError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError('');
    setSuccess('');

    let errors = {};

    if (!isValidFirstName(formData.firstName)) {
      errors.firstName = 'First name must be at least 3 characters';
    }

    if (!isValidLastName(formData.lastName)) {
      errors.lastName = 'Last name must be at least 2 characters if provided';
    }

    if (!isValidGmail(formData.email)) {
      errors.email = 'Email must be a valid Gmail address';
    }

    if (!isValidPhone(formData.phoneNo)) {
      errors.phoneNo = 'Phone number must be 10 digits and start with 6, 7, 8, or 9';
    }

    if (!isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting registration:', formData);
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);
      console.log('Registration response:', response.data);
      
      // Show full-screen success overlay
      setShowSuccessOverlay(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNo: '',
        address: '',
        state: '',
        city: '',
        role: 'CUSTOMER'
      });
      setCities([]);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error('Registration error:', err);
      setGeneralError(
        err.response?.data?.error ||
        err.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Full-Screen Success Overlay */}
      {showSuccessOverlay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(168, 230, 207, 0.98)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <div style={{
            textAlign: 'center',
            animation: 'bounceIn 0.8s ease-out'
          }}>
            {/* Success Icon */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'white',
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(127, 209, 174, 0.4)',
              animation: 'scaleIn 0.6s ease-out'
            }}>
              <svg 
                width="60" 
                height="60" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#7fd1ae" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            {/* Success Message */}
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              color: 'var(--text-dark)',
              marginBottom: '20px',
              animation: 'slideUp 0.8s ease-out'
            }}>
              Registration Successful! 🎉
            </h1>
            
            <p style={{
              fontSize: '20px',
              color: 'var(--text-dark)',
              marginBottom: '30px',
              opacity: 0.8
            }}>
              Your account has been created successfully
            </p>

            {/* Loading Spinner */}
            <div style={{ marginTop: '20px' }}>
              <Spinner 
                animation="border" 
                style={{ 
                  color: 'var(--pastel-green-dark)',
                  width: '40px',
                  height: '40px'
                }} 
              />
              <p style={{
                fontSize: '16px',
                color: 'var(--text-dark)',
                marginTop: '15px',
                opacity: 0.7
              }}>
                Redirecting to login page...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <div className="auth-container">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-logo">
              <span className="brand-icon">🏠</span>
              <h1 className="brand-title">RENT-IT</h1>
            </div>
            <p className="auth-subtitle">Join us today</p>
          </div>

          {generalError && <Alert variant="danger">{generalError}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                    isInvalid={!!fieldErrors.firstName}
                  />
                  {fieldErrors.firstName && (
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.firstName}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    isInvalid={!!fieldErrors.lastName}
                  />
                  {fieldErrors.lastName && (
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.lastName}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                isInvalid={!!fieldErrors.email}
              />
              {fieldErrors.email && (
                <Form.Control.Feedback type="invalid">
                  {fieldErrors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNo"
                maxLength={10}
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                isInvalid={!!fieldErrors.phoneNo}
              />
              {fieldErrors.phoneNo && (
                <Form.Control.Feedback type="invalid">
                  {fieldErrors.phoneNo}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                 
                  <Form.Select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state.stateId} value={state.stateId}>
                        {state.stateName}
                      </option>
                    ))}
                  </Form.Select>

                  {states.length === 0 && (
                    <Form.Text className="text-muted">
                      Loading states...
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                 
                  <Form.Select
                    name="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        city: Number(e.target.value)
                      }))
                    }
                    disabled={!formData.state}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.cityId} value={city.cityId}>
                        {city.cityName}
                      </option>
                    ))}
                  </Form.Select>


                  {!formData.state && (
                    <Form.Text className="text-muted">
                      Please select a state first
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                    isInvalid={!!fieldErrors.password}
                  />
                  {fieldErrors.password && (
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.password}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                    isInvalid={!!fieldErrors.confirmPassword}
                  />
                  {fieldErrors.confirmPassword && (
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.confirmPassword}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

           
            <Form.Select
              name="roleId"
              value={formData.roleId}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  roleId: Number(e.target.value)
                }))
              }
              required
            >
              <option value="">Select Role</option>
              <option value="3">Customer</option>
              <option value="2">Owner</option>
            </Form.Select>



            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </Form>

          <div className="auth-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>

      {/* Add keyframe animations to App.css */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Register;