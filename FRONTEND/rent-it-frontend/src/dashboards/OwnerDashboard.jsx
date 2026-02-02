import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import "../assets/owner-dashboard.css";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);



  if (!user) return null;

  const displayName = user.first_name || user.firstName || "Owner";

  const handleOwnerBills = () => {
    navigate("/owner/bills");
  };


  return (
    <div className="dashboard">
      <AppNavbar />

      <Container className="dashboard-content" style={{ maxWidth: "1200px" }}>
        {/* Animated Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="welcome-section"
        >
          <div className="welcome-header">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="welcome-title"
            >
              Welcome back, <span className="name-highlight">{displayName}</span>! 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="welcome-subtitle"
            >
              Manage your products and rental listings
            </motion.p>
          </div>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="role-badge-modern"
          >
            OWNER Account
          </motion.span>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="quick-actions-section"
        >
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">⚡</span>
              Quick Actions
            </h2>
          </div>

          <div className="actions-grid">
            {/* Add Product Card */}
            <motion.div
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(107, 207, 155, 0.25)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.8, 
                duration: 0.5,
                y: { duration: 0.2 },
                boxShadow: { duration: 0.2 }
              }}
              onClick={() => navigate("/owner/add-product")}
              className="action-card primary-card"
            >
              <div className="card-icon-wrapper">
                <div className="card-icon">➕</div>
              </div>
              <div className="card-content">
                <h3 className="card-title">Add Product</h3>
                <p className="card-description">List a new item for rent</p>
              </div>
              <div className="card-arrow">→</div>
            </motion.div>

            {/* My Listings Card */}
            <motion.div
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.9, 
                duration: 0.5,
                y: { duration: 0.2 },
                boxShadow: { duration: 0.2 }
              }}
              onClick={() => navigate("/owner/my-products")}
              className="action-card secondary-card"
            >
              <div className="card-icon-wrapper secondary">
                <div className="card-icon">📦</div>
              </div>
              <div className="card-content">
                <h3 className="card-title">My Listings</h3>
                <p className="card-description">View and manage your products</p>
              </div>
              <div className="card-arrow">→</div>
            </motion.div>
            {/* My Bills Card */}
            <motion.div
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 1.0, 
                duration: 0.5,
                y: { duration: 0.2 },
                boxShadow: { duration: 0.2 }
              }}
              onClick={handleOwnerBills}
              className="action-card tertiary-card"
            >
              <div className="card-icon-wrapper tertiary">
                <div className="card-icon">🧾</div>
              </div>
              <div className="card-content">
                <h3 className="card-title">My Bills</h3>
                <p className="card-description">
                  View rental invoices & earnings
                </p>
              </div>
              <div className="card-arrow">→</div>
            </motion.div>

          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="stats-section"
        >
          <div className="stats-grid">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.15 }}
              className="stat-card"
              style={{ animationDelay: "0s" }}
            >
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <p className="stat-label">Total Listings</p>
                <h3 className="stat-value">--</h3>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.15 }}
              className="stat-card"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="stat-icon">✨</div>
              <div className="stat-info">
                <p className="stat-label">Active Rentals</p>
                <h3 className="stat-value">--</h3>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.15 }}
              className="stat-card"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <p className="stat-label">Revenue</p>
                <h3 className="stat-value">--</h3>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default OwnerDashboard;