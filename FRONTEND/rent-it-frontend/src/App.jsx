import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Search from "./components/SearchPage";
import ProductDetails from "./components/ProductDetails";

import ProtectedRoute from "./components/ProtectedRoute";

// Dashboards
import OwnerDashboard from "./dashboards/OwnerDashboard";
import CustomerDashboard from "./dashboards/CustomerDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

// Owner
import AddItem from "./components/AddItem";
import EditProduct from "./components/EditProduct";
import MyProducts from "./components/MyProducts";
import OwnerBills from "./components/OwnerBills";

// Customer
import Cart from "./components/Cart";
import CustomerBills from "./components/CustomerBills";

// Admin
import UserManagement from "./components/UserManagement";
import CategoryManagement from "./components/CategoryManagement";
import ItemManagement from "./components/ItemManagement";

// Bills
import BillInvoice from "./components/BillInvoice";

function App() {
  return (
    <Router>
      <Routes>

        {/* 🌐 Public Routes */}
        <Route path="/" element={<Search />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/bill/:billNo" element={<BillInvoice />} />

        {/* 🟢 CUSTOMER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/mycart" element={<Cart />} />
          <Route path="/customer/bills" element={<CustomerBills />} />
        </Route>

        {/* 🔵 OWNER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["OWNER"]} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/add-product" element={<AddItem />} />
          <Route path="/owner/edit-product/:otId" element={<EditProduct />} />
          <Route path="/owner/my-products" element={<MyProducts />} />
          <Route path="/owner/bills" element={<OwnerBills />} />
        </Route>

        {/* 🔴 ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/category-management" element={<CategoryManagement />} />
          <Route path="/admin/item-management" element={<ItemManagement />} />
        </Route>

        {/* ❌ Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
