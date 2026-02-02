import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllItems,
  getAllCategories,
  createItem,
  updateItem,
  deleteItem
} from '../services/adminServiceAPI';
import '../css/ItemManagement.css';

const ItemManagement = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    categoryId: ''
  });

  // Popup state
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, categoriesRes] = await Promise.all([
        getAllItems(),
        getAllCategories()
      ]);

      const itemData = itemsRes.data || itemsRes;
      const categoryData = categoriesRes.data || categoriesRes;

      setItems(Array.isArray(itemData) ? itemData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setItems([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, item = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    if (mode === 'edit' && item) {
      setFormData({
        itemName: item.itemName || '',
        categoryId: item.categoryId || ''
      });
    } else {
      setFormData({ itemName: '', categoryId: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({ itemName: '', categoryId: '' });
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

    if (!formData.itemName.trim() || !formData.categoryId) {
      showPopup('Please fill in all required fields', 'error');
      return;
    }

    try {
      const payload = {
        itemName: formData.itemName,
        categoryId: parseInt(formData.categoryId)
      };

      if (modalMode === 'create') {
        await createItem(payload);
        handleCloseModal();
        showPopup(`"${formData.itemName}" has been added successfully`, 'success');
      } else {
        await updateItem(selectedItem.itemId, payload);
        handleCloseModal();
        showPopup(`"${formData.itemName}" has been updated successfully`, 'success');
      }

      fetchData();
    } catch (err) {
      console.error('Error saving item:', err);
      showPopup(`Failed to ${modalMode} item. Please try again.`, 'error');
    }
  };

  const handleDelete = async (itemId, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      return;
    }

    try {
      await deleteItem(itemId);
      fetchData();
      showPopup(`"${itemName}" has been deleted successfully`, 'success');
    } catch (err) {
      console.error('Error deleting item:', err);
      showPopup('Failed to delete item. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredItems = items.filter(item => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (item.itemName || '').toLowerCase().includes(search);
    const matchesCategory = filterCategory === 'all' ||
      item.categoryId === parseInt(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.categoryId === categoryId);
    return category ? category.type : 'Unknown';
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading items...</p>
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
            <h1>Item Management</h1>
            <p className="welcome-text">Manage product items</p>
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
        <button onClick={() => navigate('/admin/category-management')} className="nav-btn">📁 Category Management</button>
        <button onClick={() => navigate('/admin/item-management')} className="nav-btn active">📦 Item Management</button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        <div className="management-section">
          <div className="section-header">
            <div>
              <h2>Manage Items</h2>
              <p>Create, edit, and delete product items</p>
            </div>
            <button className="btn-create" onClick={() => handleOpenModal('create')}>
              ➕ Add New Item
            </button>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filter-group">
              <label>🔍 Search:</label>
              <input
                type="text" placeholder="Search items..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>📁 Category:</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      <div className="no-data-content">
                        <span className="no-data-icon">📦</span>
                        <p>No items found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.itemId}>
                      <td>{item.itemId}</td>
                      <td className="item-name">{item.itemName}</td>
                      <td>
                        <span className="category-badge">{getCategoryName(item.categoryId)}</span>
                      </td>
                      <td className="action-buttons">
                        <button onClick={() => handleOpenModal('edit', item)} className="btn-edit">✏️ Edit</button>
                        <button onClick={() => handleDelete(item.itemId, item.itemName)} className="btn-delete">🗑️ Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="summary-section">
            <div className="summary-stats">
              <div className="summary-item">
                <span className="summary-label">Showing:</span>
                <span className="summary-value">{filteredItems.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Items:</span>
                <span className="summary-value">{items.length}</span>
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
              <h2>{modalMode === 'create' ? '➕ Create New Item' : '✏️ Edit Item'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text" name="itemName" value={formData.itemName}
                  onChange={handleInputChange} placeholder="e.g., Laptop, Chair, Car"
                  className="form-input" required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="categoryId" value={formData.categoryId}
                  onChange={handleInputChange} className="form-select" required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>{cat.type}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-submit">
                  {modalMode === 'create' ? 'Create Item' : 'Update Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemManagement;