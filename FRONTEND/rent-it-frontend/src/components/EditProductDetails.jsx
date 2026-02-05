import { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { ownerService } from "../services/api";
import Select from "react-select";

const EditProductDetails = ({ otId }) => {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "UNAVAILABLE", label: "Unavailable" }
  ];

  useEffect(() => {
    ownerService.getProductById(otId).then(res => {
      setForm(res.data);
    });
  }, [otId]);

  if (!form) return <p>Loading...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error while typing
    setErrors({ ...errors, [name]: "" });
  };

  /* =======================
     VALIDATION LOGIC
     ======================= */
  const validate = () => {
    const newErrors = {};

    if (!form.brand?.trim())
      newErrors.brand = "Brand is required";

    if (!form.description?.trim())
      newErrors.description = "Description is required";

    if (!form.conditionType?.trim())
      newErrors.conditionType = "Condition is required";

    if (form.rentPerDay <= 0)
      newErrors.rentPerDay = "Rent per day must be greater than 0";

    if (form.depositAmt < 0)
      newErrors.depositAmt = "Deposit cannot be negative";

    if (form.maxRentDays <= 0)
      newErrors.maxRentDays = "Max rent days must be greater than 0";

    if (!form.status)
      newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      await ownerService.updateProductDetails(otId, form);
      setMsg("✅ Product updated successfully");
    } catch {
      setMsg("❌ Failed to update product");
    }
  };

  return (
    <>
      {msg && <Alert>{msg}</Alert>}

      <Form>
        {/* Brand */}
        <Form.Label>Brand</Form.Label>
        <Form.Control
          name="brand"
          value={form.brand}
          onChange={handleChange}
          isInvalid={!!errors.brand}
        />
        <Form.Control.Feedback type="invalid">
          {errors.brand}
        </Form.Control.Feedback>

        {/* Description */}
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={form.description}
          onChange={handleChange}
          isInvalid={!!errors.description}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>

        {/* Condition */}
        <Form.Label>Condition</Form.Label>
        <Form.Control
          name="conditionType"
          value={form.conditionType}
          onChange={handleChange}
          isInvalid={!!errors.conditionType}
        />
        <Form.Control.Feedback type="invalid">
          {errors.conditionType}
        </Form.Control.Feedback>

        {/* Rent */}
        <Form.Label>Rent per Day (₹)</Form.Label>
        <Form.Control
          type="number"
          name="rentPerDay"
          min="1"
          value={form.rentPerDay}
          onChange={handleChange}
          isInvalid={!!errors.rentPerDay}
        />
        <Form.Control.Feedback type="invalid">
          {errors.rentPerDay}
        </Form.Control.Feedback>

        {/* Deposit */}
        <Form.Label>Security Deposit (₹)</Form.Label>
        <Form.Control
          type="number"
          name="depositAmt"
          min="0"
          value={form.depositAmt}
          onChange={handleChange}
          isInvalid={!!errors.depositAmt}
        />
        <Form.Control.Feedback type="invalid">
          {errors.depositAmt}
        </Form.Control.Feedback>

        {/* Max Days */}
        <Form.Label>Max Rent Days</Form.Label>
        <Form.Control
          type="number"
          name="maxRentDays"
          min="1"
          value={form.maxRentDays}
          onChange={handleChange}
          isInvalid={!!errors.maxRentDays}
        />
        <Form.Control.Feedback type="invalid">
          {errors.maxRentDays}
        </Form.Control.Feedback>

        {/* Status */}
        <Form.Label>Status</Form.Label>
        <Select
          classNamePrefix="react-select"
          options={statusOptions}
          value={statusOptions.find(opt => opt.value === form.status)}
          onChange={(option) =>
            handleChange({
              target: { name: "status", value: option.value }
            })
          }
        />
        {errors.status && (
          <div className="text-danger small mt-1">
            {errors.status}
          </div>
        )}

        <Button className="mt-3" onClick={submit}>
          Update Details
        </Button>
      </Form>
    </>
  );
};

export default EditProductDetails;
