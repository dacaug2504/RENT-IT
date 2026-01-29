import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SuccessScreen = ({
  title,
  message,
  redirectTo,
  delay = 3000
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo);
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, redirectTo, delay]);

  return (
    <div className="success-overlay">
      <div className="success-content">
        <div className="success-icon">
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

        <h1 className="success-title">{title}</h1>
        <p className="success-message">{message}</p>

        <Spinner animation="border" />
        <p className="success-redirect">Redirecting…</p>
      </div>
    </div>
  );
};

export default SuccessScreen;
