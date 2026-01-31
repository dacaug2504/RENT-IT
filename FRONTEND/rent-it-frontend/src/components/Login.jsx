import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { authService } from "../services/api";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);

      console.log(response.data);

      if (!response.data || !response.data.token || !response.data.user) {
        setError('Invalid login response');
        setLoading(false);
        return;
      }

      // /* =========================
      //    ✅ SAVE JWT TOKEN
      //    ========================= */
      // localStorage.setItem('token', response.data.token);

      // /* =========================
      //    ✅ SAVE USER (NO PASSWORD)
      //    ========================= */
      // userService.saveUser(response.data.user);

      /* =========================
        ✅ SAVE AUTH DATA TO REDUX
        ========================= */
      dispatch(
        loginSuccess({
          user: response.data.user,
          token: response.data.token
        })
      );


      /* =========================
         ✅ ROLE BASED REDIRECT
         ========================= */
      let role = null;

      const userRole = response.data.user.role;

      if (userRole) {
        // Handle both backend naming styles safely
        role = (
          userRole.role_name ||   // snake_case
          userRole.roleName ||    // camelCase
          userRole               // string fallback
        );

        if (typeof role === 'string') {
          role = role.toLowerCase();
        }
      }

      if (!role) {
        console.error("Invalid role object:", response.data.user.role);
        setError('Unable to determine user role');
        setLoading(false);
        return;
      }

      

      navigate(`/${role}/dashboard`);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 403) {
        setError('Your account is inactive. Please contact support.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </Form>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
