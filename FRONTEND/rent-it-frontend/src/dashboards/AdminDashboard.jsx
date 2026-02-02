import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAdminStats } from "../services/adminServiceAPI";
import { forceLogout } from "../features/auth/authSlice";
import { persistor } from "../app/store";
import "../assets/admin-dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCategories: 0,
    totalItems: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // ✅ FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAdminStats();

      setStats({
        totalUsers: res.totalUsers ?? 0,
        activeUsers: res.activeUsers ?? 0,
        totalCategories: res.totalCategories ?? 0,
        totalItems: res.totalItems ?? 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ✅ FIXED LOGOUT (CRITICAL)
  // =========================
  const handleLogout = async () => {
    // 1️⃣ Clear Redux auth state
    dispatch(forceLogout());

    // 2️⃣ Purge redux-persist storage
    await persistor.purge();

    // 3️⃣ Clear any leftovers (safe)
    localStorage.clear();

    // 4️⃣ Redirect to login
    navigate("/search", { replace: true });
  };

  // =========================
  // ⏳ LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ❌ ERROR STATE
  // =========================
  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // ✅ MAIN UI (UNCHANGED)
  // =========================
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p className="welcome-text">Welcome back, Administrator</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button
          className="nav-btn active"
          onClick={() => navigate("/admin/dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate("/admin/user-management")}
        >
          👥 User Management
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate("/admin/category-management")}
        >
          📁 Category Management
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate("/admin/item-management")}
        >
          📦 Item Management
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        <div className="dashboard-grid">
          <div className="stat-card stat-card-users">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
              <span className="stat-label">Registered users</span>
            </div>
          </div>

          <div className="stat-card stat-card-active">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Active Users</h3>
              <p className="stat-number">{stats.activeUsers}</p>
              <span className="stat-label">Currently active</span>
            </div>
          </div>

          <div className="stat-card stat-card-categories">
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <h3>Categories</h3>
              <p className="stat-number">{stats.totalCategories}</p>
              <span className="stat-label">Product categories</span>
            </div>
          </div>

          <div className="stat-card stat-card-items">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Items</h3>
              <p className="stat-number">{stats.totalItems}</p>
              <span className="stat-label">Listed items</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
