import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUserStatus } from '../services/adminServiceAPI';
import '../css/UserManagement.css';
import { useDispatch } from "react-redux";
import { persistor } from "../app/store";
import { forceLogout } from "../features/auth/authSlice";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // ✅ NEW STATE (logic only)
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, filterRole, filterStatus, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers();
      const userData = response.data || response;
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
  // 🚫 ALWAYS exclude admins
  let filtered = users.filter(
    user => user.roleName?.toUpperCase() !== 'ADMIN'
  );

  // Role filter (OWNER / CUSTOMER)
  if (filterRole !== 'all') {
    filtered = filtered.filter(
      user => user.roleName?.toUpperCase() === filterRole.toUpperCase()
    );
  }

  // Status filter
  if (filterStatus !== 'all') {
    const statusMap = {
      active: 1,
      suspended: 2,
      disabled: 3
    };
    filtered = filtered.filter(
      user => user.status === statusMap[filterStatus]
    );
  }

  // Search filter
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filtered = filtered.filter(user => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      return fullName.includes(search) || email.includes(search);
    });
  }

  setFilteredUsers(filtered);
};


  // ✅ UPDATED — NO alert(), only message state
  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.userId === userId
            ? { ...user, status: newStatus }
            : user
        )
      );

      const message =
        newStatus === 1
          ? 'Account activated successfully'
          : newStatus === 2
          ? 'Account suspended successfully'
          : 'Account disabled successfully';

      setStatusMessage(message);
    } catch (err) {
      console.error('Error updating user status:', err);
      setStatusMessage('Failed to update user status');
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   navigate('/login');
  // };

  const dispatch = useDispatch();

const handleLogout = async () => {
  // 1️⃣ Clear redux auth state
  dispatch(forceLogout());

  // 2️⃣ Clear persisted redux state
  await persistor.purge();

  // 3️⃣ Clear local storage (safety)
  localStorage.clear();

  // 4️⃣ HARD redirect (prevents auto-redirect)
  window.location.href = "/search";
};
  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Active';
      case 2: return 'Suspended';
      case 3: return 'Disabled';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1: return 'status-active';
      case 2: return 'status-suspended';
      case 3: return 'status-disabled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchUsers} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h1>User Management</h1>
            <p className="welcome-text">Manage user accounts and permissions</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button onClick={() => navigate('/admin/dashboard')} className="nav-btn">
          📊 Dashboard
        </button>
        <button onClick={() => navigate('/admin/user-management')} className="nav-btn active">
          👥 User Management
        </button>
        <button onClick={() => navigate('/admin/category-management')} className="nav-btn">
          📁 Category Management
        </button>
        <button onClick={() => navigate('/admin/item-management')} className="nav-btn">
          📦 Item Management
        </button>
        {/* <button onClick={() => navigate('/admin/statistics')} className="nav-btn">
          📈 Statistics
        </button> */}
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        <div className="management-section">

          {/* Filters */}
          <div className="filters-section">
            <div className="filter-group">
              <label>🔍 Search:</label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>👤 Role:</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="OWNER">Owner</option>
                <option value="CUSTOMER">Customer</option>
                {/* <option value="ADMIN">Admin</option> */}
              </select>
            </div>

            <div className="filter-group">
              <label>📊 Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      <div className="no-data-content">
                        <span className="no-data-icon">👥</span>
                        <p>No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td className="user-name">
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phoneNo || '-'}</td>
                      <td>
                        <span className={`role-badge ${user.roleName?.toLowerCase()}`}>
                          {user.roleName}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(user.status)}`}>
                          {getStatusText(user.status)}
                        </span>
                      </td>
                      <td className="action-buttons">
                        {user.status !== 1 && (
                          <button
                            onClick={() => handleUpdateStatus(user.userId, 1)}
                            className="btn-action btn-activate"
                          >
                            ✓ Activate
                          </button>
                        )}
                        {user.status !== 2 && (
                          <button
                            onClick={() => handleUpdateStatus(user.userId, 2)}
                            className="btn-action btn-suspend"
                          >
                            ⏸ Suspend
                          </button>
                        )}
                        {user.status !== 3 && (
                          <button
                            onClick={() => handleUpdateStatus(user.userId, 3)}
                            className="btn-action btn-disable"
                          >
                            ✕ Disable
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ✅ FLOATING MESSAGE — REUSES EXISTING STYLES */}
    {statusMessage && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}
  >
    <div
      style={{
        background: '#e8f5e9',          // pastel green
        borderRadius: '16px',            // curved edges
        padding: '28px 36px',
        minWidth: '320px',
        textAlign: 'center',
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
      }}
    >
      <p
        style={{
          marginBottom: '20px',
          fontSize: '16px',
          fontWeight: '600',
          color: '#2e7d32'
        }}
      >
        {statusMessage}
      </p>

      <button
        onClick={() => setStatusMessage('')}
        style={{
          background: '#66bb6a',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          padding: '8px 22px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        OK
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default UserManagement;