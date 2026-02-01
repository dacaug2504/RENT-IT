import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import OwnerDashboard from "./dashboards/OwnerDashboard";
import CustomerDashboard from "./dashboards/CustomerDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

import ProtectedRoute from './components/ProtectedRoute';
import AddItem from './components/AddItem';
import EditProduct from './components/EditProduct';
import MyProducts from './components/MyProducts';
import Search from './components/SearchPage';
import Cart from "./components/Cart";
import ProductDetails from './components/ProductDetails';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search/>}/>
        <Route path="/mycart" element={<Cart />} />
        <Route path="/productdetails" element={<ProductDetails />} />
        

        

        <Route
          path="/owner/edit-product/:otId"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        

        <Route
          path="/owner/my-products"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <MyProducts />
            </ProtectedRoute>
          }
        />


        
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/owner/add-product"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <AddItem />
            </ProtectedRoute>
          }
        />

        
       
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;