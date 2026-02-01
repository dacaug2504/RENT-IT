import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const displayName = user.first_name || user.firstName || "Owner";



  return (
    <div className="dashboard">
      <AppNavbar />

      <Container className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome back, {displayName}! 👋</h1>
          <p>Manage your products and rental listings</p>
          <span className="role-badge">OWNER Account</span>
        </div>

        <div className="welcome-card" style={{ marginTop: "30px" }}>
          <h4>⚡ Quick Actions</h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {/* ADD PRODUCT */}
            <motion.div
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/owner/add-product")}
              style={cardStyle("#6BCF9B")}
            >
              ➕ Add Product
            </motion.div>

            {/* MY PRODUCTS */}
            <motion.div
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/owner/my-products")}
              style={cardStyle("#fff", true)}
            >
              📦 My Listings
            </motion.div>
          </div>

        
        </div>
      </Container>
    </div>
  );
};

const cardStyle = (bg, bordered = false) => ({
  cursor: "pointer",
  padding: "24px",
  borderRadius: "16px",
  background: bg,
  color: bordered ? "#000" : "#fff",
  border: bordered ? "1px solid #ddd" : "none",
  fontWeight: "600",
});

export default OwnerDashboard;
