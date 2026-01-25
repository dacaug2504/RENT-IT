import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { userService } from '../services/api';

const Dashboard = ({ role }) => {
  const navigate = useNavigate();
  const user = userService.getCurrentUser();

  const handleLogout = () => {
    userService.logout();
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
      <Navbar bg="light" expand="lg" className="navbar">
        <Container>
          <Navbar.Brand>🏠 Rent-It System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              {role === 'customer' && (
                <>
                  <Nav.Link href="#appliances">Browse Appliances</Nav.Link>
                  <Nav.Link href="#rentals">My Rentals</Nav.Link>
                </>
              )}
              {role === 'owner' && (
                <>
                  {/* <Nav.Link onClick={() => navigate('/owner/my-items')}>My Listings</Nav.Link>
                  <Nav.Link onClick={() => navigate('/owner/add-item')}>Add Appliance</Nav.Link> */}
                  <Nav.Link href="#listings">My Listings</Nav.Link>
                  <Nav.Link href="#addlistings">Add Appliances</Nav.Link>
                  <Nav.Link href="#requests">Rental Requests</Nav.Link>
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
      </Navbar>

      <Container className="dashboard-content">
        <div className="welcome-card">
          <h1 className="welcome-title">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="welcome-text">{getRoleDescription()}</p>
          <span className="role-badge">
            {user.role} Account
          </span>
        </div>

        <div className="welcome-card">
          <h2 style={{ color: 'var(--text-dark)', marginBottom: '20px' }}>
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '16px', lineHeight: '1.6' }}>
            Your dashboard is ready! Start exploring the features available to you.
          </p>
          
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>
              Quick Stats
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px',
              marginTop: '20px'
            }}>
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, var(--pastel-green-light) 0%, var(--pastel-mint) 100%)',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'var(--text-dark)', margin: 0 }}>0</h3>
                <p style={{ color: 'var(--text-light)', margin: '5px 0 0 0', fontSize: '14px' }}>
                  {role === 'customer' ? 'Active Rentals' : role === 'owner' ? 'Active Listings' : 'Total Users'}
                </p>
              </div>
              
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, var(--pastel-mint) 0%, var(--pastel-green-light) 100%)',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'var(--text-dark)', margin: 0 }}>0</h3>
                <p style={{ color: 'var(--text-light)', margin: '5px 0 0 0', fontSize: '14px' }}>
                  {role === 'customer' ? 'Past Rentals' : role === 'owner' ? 'Pending Requests' : 'Total Listings'}
                </p>
              </div>
              
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, var(--pastel-green) 0%, var(--pastel-green-light) 100%)',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'var(--text-dark)', margin: 0 }}>
                  {role === 'customer' ? '₹0' : role === 'owner' ? '₹0' : '0'}
                </h3>
                <p style={{ color: 'var(--text-light)', margin: '5px 0 0 0', fontSize: '14px' }}>
                  {role === 'customer' ? 'Total Spent' : role === 'owner' ? 'Total Earned' : 'Active Rentals'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;