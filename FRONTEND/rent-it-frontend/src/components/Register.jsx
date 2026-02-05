import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Select from "react-select";
import { Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { authService, userService } from '../services/api';
import axios from 'axios';
import SuccessScreen from "../components/SuccessScreen";



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

  const stateOptions = states.map(s => ({
    value: s.stateId,
    label: s.stateName
  }));

  const cityOptions = cities.map(c => ({
    value: c.cityId,
    label: c.cityName
  }));


  const fetchStates = async () => {
    try {
      // console.log('Fetching states from: http://localhost:8081/states');
      const response = await axios.get('http://localhost:8765/states');
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
      const response = await axios.get(`http://localhost:8765/cities/${stateId}`);
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
        <SuccessScreen
          title="Registration Successful! 🎉"
          message="Your account has been created successfully"
          redirectTo="/login"
        />
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
                 
                  <Select
                    classNamePrefix="react-select"
                    placeholder="Select State"
                    options={stateOptions}
                    onChange={(option) => {
                      handleStateChange({ target: { value: option.value } });
                    }}
                  />


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
                 
                  <Select
                    classNamePrefix="react-select"
                    placeholder="Select City"
                    options={cityOptions}
                    isDisabled={!formData.state}
                    onChange={(option) =>
                      setFormData(prev => ({
                        ...prev,
                        city: option.value
                      }))
                    }
                  />



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

            <Form.Label>Select Role</Form.Label>
            <Select
              className="mb-4"
              classNamePrefix="react-select"
              placeholder="Select Role"
              options={[
                { value: 3, label: "Customer" },
                { value: 2, label: "Owner" }
              ]}
              onChange={(option) =>
                setFormData(prev => ({
                  ...prev,
                  roleId: option.value
                }))
              }
            />




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