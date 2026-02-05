import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/adminServiceAPI';
import '../css/CategoryManagement.css';

import { useDispatch } from "react-redux";
import { forceLogout } from "../features/auth/authSlice";
import { persistor } from "../app/store";


const CategoryManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    description: ''
  });

  // Popup state
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      const categoryData = response.data || response;
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    if (mode === 'edit' && category) {
      setFormData({
        type: category.type || '',
        description: category.description || ''
      });
    } else {
      setFormData({ type: '', description: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setFormData({ type: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type.trim()) {
      showPopup('Category type is required', 'error');
      return;
    }

    try {
      if (modalMode === 'create') {
        await createCategory(formData);
        handleCloseModal();
        showPopup(`"${formData.type}" has been added successfully`, 'success');
      } else {
        await updateCategory(selectedCategory.categoryId, formData);
        handleCloseModal();
        showPopup(`"${formData.type}" has been updated successfully`, 'success');
      }

      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      showPopup(`Failed to ${modalMode} category. Please try again.`, 'error');
    }
  };

  const handleDelete = async (categoryId, categoryType) => {
    if (!window.confirm(`Are you sure you want to delete the category "${categoryType}"?`)) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      fetchCategories();
      showPopup(`"${categoryType}" has been deleted successfully`, 'success');
    } catch (err) {
      console.error('Error deleting category:', err);
      showPopup('Failed to delete category. It may have associated items.', 'error');
    }
  };

  /* =========================
     LOGOUT HANDLER
     ========================= */

const handleLogout = async () => {
  dispatch(forceLogout());
  await persistor.purge();
  localStorage.removeItem("token");
  navigate("/login", { replace: true });
};

  const filteredCategories = categories.filter(category => {
    const search = searchTerm.toLowerCase();
    return (
      (category.type || '').toLowerCase().includes(search) ||
      (category.description || '').toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* Centered Popup */}
      {popup.show && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '36px 32px 28px',
            width: '100%', maxWidth: '380px', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'popupFadeIn 0.25s ease forwards'
          }}>
            {/* Icon */}
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: popup.type === 'success' ? '#dcfce7' : '#fee2e2',
              fontSize: '26px'
            }}>
              {popup.type === 'success' ? '✓' : '✕'}
            </div>

            {/* Title */}
            <h3 style={{
              margin: '0 0 8px', fontSize: '18px', fontWeight: '600',
              color: popup.type === 'success' ? '#16a34a' : '#dc2626'
            }}>
              {popup.type === 'success' ? 'Success' : 'Error'}
            </h3>

            {/* Message */}
            <p style={{
              margin: '0 0 24px', fontSize: '14px', color: '#6b7280', lineHeight: '1.5'
            }}>
              {popup.message}
            </p>

            {/* OK Button */}
            <button
              onClick={() => setPopup({ show: false, message: '', type: 'success' })}
              style={{
                background: popup.type === 'success' ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '10px 32px', fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', transition: 'opacity 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popupFadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Category Management</h1>
            <p className="welcome-text">Manage product categories</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button onClick={() => navigate('/admin/dashboard')} className="nav-btn">📊 Dashboard</button>
        <button onClick={() => navigate('/admin/user-management')} className="nav-btn">👥 User Management</button>
        <button onClick={() => navigate('/admin/category-management')} className="nav-btn active">📁 Category Management</button>
        <button onClick={() => navigate('/admin/item-management')} className="nav-btn">📦 Item Management</button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        <div className="management-section">
          <div className="section-header">
            <div>
              <h2>Manage Categories</h2>
              <p>Create, edit, and delete product categories</p>
            </div>
            <button className="btn-create" onClick={() => handleOpenModal('create')}>
              ➕ Add New Category
            </button>
          </div>

          {/* Search */}
          <div className="filters-section">
            <div className="filter-group">
              <label>🔍 Search:</label>
              <input
                type="text" placeholder="Search categories..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="categories-grid">
            {filteredCategories.length === 0 ? (
              <div className="no-data-card">
                <span className="no-data-icon">📁</span>
                <p>No categories found</p>
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="btn-clear-search">
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.categoryId} className="category-card">
                  <div className="category-header">
                    <h3>{category.type}</h3>
                    <span className="category-id">ID: {category.categoryId}</span>
                  </div>
                  <div className="category-body">
                    <p className="category-description">
                      {category.description || 'No description available'}
                    </p>
                    <div className="category-stats">
                      <span className="stat-item">📦 {category.items?.length || 0} items</span>
                    </div>
                  </div>
                  <div className="category-actions">
                    <button onClick={() => handleOpenModal('edit', category)} className="btn-edit">✏️ Edit</button>
                    <button onClick={() => handleDelete(category.categoryId, category.type)} className="btn-delete">🗑️ Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="summary-section">
            <div className="summary-stats">
              <div className="summary-item">
                <span className="summary-label">Showing:</span>
                <span className="summary-value">{filteredCategories.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Categories:</span>
                <span className="summary-value">{categories.length}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? '➕ Create New Category' : '✏️ Edit Category'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Type *</label>
                <input
                  type="text" name="type" value={formData.type}
                  onChange={handleInputChange} placeholder="e.g., Electronics, Furniture, Vehicles"
                  className="form-input" required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description" value={formData.description}
                  onChange={handleInputChange} placeholder="Enter category description..."
                  className="form-textarea" rows="4"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-submit">
                  {modalMode === 'create' ? 'Create Category' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;