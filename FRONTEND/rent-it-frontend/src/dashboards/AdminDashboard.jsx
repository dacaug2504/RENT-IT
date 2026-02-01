import { Container, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

const AdminDashboard = () => {

  return (
    <div>
      <AppNavbar />
      <Container>
        <h1>Admin Dashboard 🛡️</h1>
        <p>Manage users, products, and platform settings</p>

        
      </Container>
    </div>
  );
};

export default AdminDashboard;
