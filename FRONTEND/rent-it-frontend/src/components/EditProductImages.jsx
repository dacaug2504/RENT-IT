import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { ownerService } from '../services/api';

const EditProductImages = ({ otId }) => {
  const [existingImages, setExistingImages] = useState({});
  const [newImages, setNewImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const imageKeys = ['img1', 'img2', 'img3', 'img4', 'img5'];

  /* =========================
     LOAD EXISTING IMAGES
     ========================= */
  useEffect(() => {
    ownerService.getProductImages(otId)
      .then(res => setExistingImages(res.data))
      .catch(() => setError('Failed to load images'));
  }, [otId]);

  /* =========================
     IMAGE CHANGE
     ========================= */
  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewImages(prev => ({
      ...prev,
      [key]: file
    }));
  };

  /* =========================
     DELETE IMAGE
     ========================= */
  const handleDeleteImage = async (key) => {
    if (!window.confirm('Delete this image?')) return;

    try {
      await ownerService.deleteProductImage(otId, key);

      setExistingImages(prev => ({
        ...prev,
        [key]: null
      }));

      setNewImages(prev => ({
        ...prev,
        [key]: null
      }));

      setSuccess('Image deleted successfully');
    } catch {
      setError('Failed to delete image');
    }
  };

  /* =========================
     UPDATE IMAGES
     ========================= */
  const handleUpdateImages = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await ownerService.updateProductImages(otId, newImages);

      const res = await ownerService.getProductImages(otId);
      setExistingImages(res.data);
      setNewImages({});

      setSuccess('Images updated successfully');
    } catch {
      setError('Failed to update images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0">


      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="g-3">
        {imageKeys.map(key => (
          <Col md={4} key={key}>
            <Card className="p-2 text-center h-100">

              {/* IMAGE PREVIEW */}
              {newImages[key] ? (
                <img
                  src={URL.createObjectURL(newImages[key])}
                  alt="preview"
                  style={{ height: '140px', objectFit: 'cover' }}
                />
              ) : existingImages[key] ? (
                <img
                  src={`data:image/jpeg;base64,${existingImages[key]}`}
                  alt="product"
                  style={{ height: '140px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                  }}
                >
                  No Image
                </div>
              )}

              {/* FILE INPUT */}
              <Form.Control
                type="file"
                accept="image/*"
                className="mt-2"
                onChange={(e) => handleImageChange(e, key)}
              />

              {/* DELETE BUTTON */}
              {(existingImages[key] || newImages[key]) && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleDeleteImage(key)}
                >
                  Delete
                </Button>
              )}

            </Card>
          </Col>
        ))}
      </Row>

      <Button
        className="mt-4 w-100"
        disabled={loading}
        onClick={handleUpdateImages}
      >
        {loading ? 'Updating...' : 'Update Images'}
      </Button>
    </Card>
  );
};

export default EditProductImages;
