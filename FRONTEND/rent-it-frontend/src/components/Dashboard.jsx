import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import AppNavbar from "../components/AppNavbar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { motion } from 'framer-motion';


const Dashboard = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  if (!user) {
    return null; // ProtectedRoute already handles redirect
  }



  let roleName = null;
  const userRole = user.role;

  if (typeof userRole === 'object' && userRole !== null) {
    roleName = userRole.roleName || userRole.role_name;
  } else {
    roleName = userRole;
  }



  roleName = roleName?.toUpperCase();


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };


  if (!user) {
    navigate('/login');
    return null;
  }

  const displayName = user.first_name || user.firstName || 'User';

  const getRoleDescription = () => {
    switch (role) {
      case 'customer':
        return 'Browse and rent home appliances from verified owners';
      case 'owner':
        return 'List your home appliances and manage rental requests';
      case 'admin':
        return 'Manage users, listings, and system settings';
      default:
        return 'Welcome to Rent-It System';
    }
  };

  return (
    <div className="dashboard">
      <AppNavbar />
      {/* <Navbar bg="light" expand="lg" className="navbar">
        <Container>
          <Navbar.Brand>🏠 Rent-It System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {role === 'customer' && (
                <>
                  <Nav.Link href="#appliances">Browse Appliances</Nav.Link>
                  <Nav.Link href="#rentals">My Rentals</Nav.Link>
                </>
              )}
              {role === 'owner' && (
                <>
                  {/* <Nav.Link onClick={() => navigate('/owner/my-items')}>My Listings</Nav.Link>
                  <Nav.Link onClick={() => navigate('/owner/add-item')}>Add Appliance</Nav.Link> */}{/*
                  <Nav.Link onClick={()=> navigate('/owner/my-products')}>
                    My Listings
                  </Nav.Link>

                  <Nav.Link onClick={() => navigate('/owner/add-product')}>
                    Add Product
                  </Nav.Link>

                </>
              )}
              {role === 'admin' && (
                <>
                  <Nav.Link href="#users">Manage Users</Nav.Link>
                  <Nav.Link href="#listings">All Listings</Nav.Link>
                  <Nav.Link href="#reports">Reports</Nav.Link>
                </>
              )}
              <Button 
                variant="outline-primary" 
                onClick={handleLogout}
                className="ms-2"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}

      <Container className="dashboard-content">
        <div className="welcome-card">
          <h1 className="welcome-title">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="welcome-text">{getRoleDescription()}</p>
          <span className="role-badge">
            {roleName} Account
          </span>

        </div>

        <div className="welcome-card" style={{ marginTop: '30px' }}>
          <h4 style={{ color: 'var(--text-dark)', marginBottom: '20px' }}>
            ⚡ Quick Actions
          </h4>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Add Item */}
            <motion.div
              whileHover={{
                y: -8,
                boxShadow: '0 18px 36px rgba(0,0,0,0.15)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: 'spring',
                stiffness: 220,
                damping: 18
              }}
              onClick={() => navigate('/owner/add-product')}
              style={{
                cursor: 'pointer',
                padding: '24px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--pastel-green) 0%, var(--pastel-green-dark) 100%)',
                color: '#fff',
                fontWeight: '600'
              }}
            >


              <div style={{ fontSize: '32px', marginBottom: '10px' }}>➕</div>
              Add New Item
              <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.9 }}>
                List a new appliance for rent
              </p>
            </motion.div>

            {/* My Listings */}
            <motion.div
              whileHover={{
                y: -8,
                boxShadow: '0 18px 36px rgba(0,0,0,0.12)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: 'spring',
                stiffness: 220,
                damping: 18
              }}
              onClick={() => navigate('/owner/my-products')}
              style={{
                cursor: 'pointer',
                padding: '24px',
                borderRadius: '16px',
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                fontWeight: '600'
              }}
            >

              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
              My Listings
              <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--text-light)' }}>
                View & manage your items
              </p>
            </motion.div>

            
          </div>
        </div>

      </Container>
    </div>
  );
};

export default Dashboard;