import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AddItem from './components/AddItem';
import EditProduct from './components/EditProduct';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DEV ROUTES */}
        {/* temp add page*/}
        <Route path="/dev/add-item" element={<AddItem />} />

        {/* temp edit page */}
        <Route path="/edit-product/:otId" element={<EditProduct />} />


        
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <Dashboard role="customer" />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <Dashboard role="owner" />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Dashboard role="admin" />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;