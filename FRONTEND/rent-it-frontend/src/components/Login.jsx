import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../features/auth/authThunks";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔐 Redux auth state (SOURCE OF TRUTH)
  const {
    user,
    isAuthenticated,
    loading,
    error: authError,
  } = useSelector((state) => state.auth);

  // 🧾 Local form state (UI ONLY)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ❌ UI error (kept for compatibility with your JSX)
  const [localError, setLocalError] = useState("");

  // 🛑 Prevent duplicate redirects
  const hasRedirected = useRef(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError("");
  };

  // =========================
  // ✅ FORM SUBMIT → REDUX
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    await dispatch(loginThunk(formData));
  };

  // =========================
  // ✅ POST-LOGIN REDIRECT
  // =========================
  useEffect(() => {
    // ⛔ Do nothing while auth state is stabilizing
    if (loading) return;

    // ⛔ Not authenticated
    if (!isAuthenticated || !user) return;

    // ⛔ Prevent double execution
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
    console.log("✅ Detected role:", role);

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

  // 🧼 Cleanup on unmount (important after logout)
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

        {(localError || authError) && (
          <Alert variant="danger">
            {localError || authError}
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
