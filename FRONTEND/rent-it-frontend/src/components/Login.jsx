import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../features/auth/authThunks";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //  Redux auth state
  const {
    user,
    isAuthenticated,
    loading,
    error: authError,
  } = useSelector((state) => state.auth);

  // Local form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //  UI error handling
  const [localError, setLocalError] = useState("");

  //  Prevent duplicate redirects
  const hasRedirected = useRef(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing again
    setLocalError("");
  };

  // =====================================
  // ✅ VALIDATION & SUBMIT
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const { email, password } = formData;

    // 1. Email validation: Must be @gmail.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setLocalError("Invalid email format. Please use a @gmail.com address.");
      return;
    }

    // 2. Password validation: 8+ chars, 1 Upper, 1 Number, 1 Special Char
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setLocalError(
        "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
      );
      return;
    }

    // Proceed to Redux login if validation passes
    await dispatch(loginThunk(formData));
  };

  // =====================================
  // ✅ POST-LOGIN REDIRECT LOGIC
  // =====================================
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) return;
    if (hasRedirected.current) return;

    const rawRole = user.role;
    let role = null;

    if (typeof rawRole === "string") {
      role = rawRole;
    } else if (typeof rawRole === "object" && rawRole !== null) {
      role = rawRole.role_name || rawRole.roleName;
    }

    if (!role) {
      console.error("❌ Unable to detect role:", rawRole);
      setLocalError("Unable to determine user role");
      return;
    }

    role = role.toUpperCase();
    hasRedirected.current = true;

    switch (role) {
      case "OWNER":
        navigate("/owner/dashboard", { replace: true });
        break;
      case "CUSTOMER":
        navigate("/customer/dashboard", { replace: true });
        break;
      case "ADMIN":
        navigate("/admin/dashboard", { replace: true });
        break;
      default:
        console.error("❌ Unknown role:", role);
        setLocalError("Unauthorized role");
        hasRedirected.current = false;
    }
  }, [isAuthenticated, user, loading, navigate]);

  // 🧼 Cleanup on unmount
  useEffect(() => {
    return () => {
      hasRedirected.current = false;
      setLocalError("");
    };
  }, []);

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

        {/* Display local validation errors or Redux auth errors */}
        {(localError || authError) && (
          <Alert variant="danger">
            {localError || (typeof authError === 'string' ? authError : "An error occurred during login")}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
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
              placeholder="Min 8 chars, 1 Upper, 1 Num, 1 Spec"
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
              "Sign In"
            )}
          </Button>
        </Form>

        <div className="auth-link">
          Don&apos;t have an account?{" "}
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;