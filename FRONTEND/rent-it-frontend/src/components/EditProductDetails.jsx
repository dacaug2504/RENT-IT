import { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { ownerService } from '../services/api';

const EditProductDetails = ({ otId }) => {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    ownerService.getProductById(otId).then(res => {
      setForm(res.data);
    });
  }, [otId]);

  if (!form) return <p>Loading...</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await ownerService.updateProductDetails(otId, form);
      setMsg('✅ Product updated');
    } catch {
      setMsg('❌ Failed to update');
    }
  };

  return (
    <>
      {msg && <Alert>{msg}</Alert>}

      <Form>
        <Form.Label>Brand</Form.Label>
        <Form.Control
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="mb-2"
        />

        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mb-2"
        />

        <Form.Label>Condition</Form.Label>
        <Form.Control
          name="conditionType"
          value={form.conditionType}
          onChange={handleChange}
          className="mb-2"
        />

        <Form.Label>Rent per Day (₹)</Form.Label>
        <Form.Control
          type="number"
          name="rentPerDay"
          value={form.rentPerDay}
          onChange={handleChange}
          className="mb-2"
        />

        <Form.Label>Security Deposit (₹)</Form.Label>
        <Form.Control
          type="number"
          name="depositAmt"
          value={form.depositAmt}
          onChange={handleChange}
          className="mb-2"
        />

        <Form.Label>Status</Form.Label>
        <Form.Select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="mb-3"
        >
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="UNAVAILABLE">UNAVAILABLE</option>
        </Form.Select>

        <Button onClick={submit}>Update Details</Button>
      </Form>
    </>
  );
};

export default EditProductDetails;
