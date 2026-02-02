import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutThunk } from "../features/auth/authThunks";
import { persistor } from "../app/store";

const AppNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // ⛔ Safety: during refresh / logout
  if (!user) return null;

  // 🔹 Normalize role safely (KEEP YOUR LOGIC)
  let role = user.role;

  if (typeof role === "object" && role !== null) {
    role = role.roleName || role.role_name || role.name;
  }

  if (typeof role === "string") {
    role = role.toLowerCase();
  }

  const handleLogout = async () => {
    // 🔐 1️⃣ Clear Redux auth state
    await dispatch(logoutThunk());

    // 🧹 2️⃣ Clear persisted auth
    await persistor.purge();

    // 🚪 3️⃣ Redirect
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="navbar">
      <Container>
        <Navbar.Brand
          style={{
            fontWeight: "700",
            fontSize: "24px",
            color: "var(--text-dark)",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/${role}/dashboard`)}
        >
          🏠 Rent-It System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* ================= OWNER ================= */}
            {role === "owner" && (
              <>
                <Nav.Link onClick={() => navigate("/owner/dashboard")}>
                  Dashboard
                </Nav.Link>

                <Nav.Link onClick={() => navigate("/owner/my-products")}>
                  My Listings
                </Nav.Link>

                <Nav.Link onClick={() => navigate("/owner/add-product")}>
                  Add Product
                </Nav.Link>
              </>
            )}

            {/* ================= CUSTOMER ================= */}
            {role === "customer" && (
              <>
                <Nav.Link onClick={() => navigate("/customer/dashboard")}>
                  Dashboard
                </Nav.Link>

                <Nav.Link onClick={() => navigate("/customer/appliances")}>
                  Browse Appliances
                </Nav.Link>

                <Nav.Link onClick={() => navigate("/customer/rentals")}>
                  My Rentals
                </Nav.Link>
              </>
            )}

            {/* ================= ADMIN ================= */}
            {role === "admin" && (
              <>
                <Nav.Link onClick={() => navigate("/admin/dashboard")}>
                  Dashboard
                </Nav.Link>

                <Nav.Link onClick={() => navigate("/admin/users")}>
                  Manage Users
                </Nav.Link>

                <Nav.Link onClick={() => navigate("/admin/listings")}>
                  All Listings
                </Nav.Link>
              </>
            )}

            {/* ================= LOGOUT ================= */}
            <Button
              variant="outline-primary"
              className="ms-3"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
