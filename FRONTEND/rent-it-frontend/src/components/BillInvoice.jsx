import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { billService } from '../services/api';
import '../App.css';

const BillInvoice = () => {
  const { billNo } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBillDetails();
  }, [billNo]);

  const fetchBillDetails = async () => {
    try {
      setLoading(true);
      const response = await billService.getBillDetails(billNo);
      console.log('Bill Details:', response.data);
      setBill(response.data);
    } catch (err) {
      console.error('Error fetching bill:', err);
      setError('Failed to load bill details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted">Loading invoice...</p>
      </Container>
    );
  }

  if (error || !bill) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger" className="mx-auto" style={{ maxWidth: '500px' }}>
          {error || 'Bill not found'}
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          ← Go Back
        </Button>
      </Container>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--soft-white) 0%, var(--pastel-green-light) 100%)',
      padding: '40px 0'
    }}>
      <Container>
        {/* Action Buttons */}
        <div className="d-flex justify-content-between mb-4 no-print">
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <Button variant="success" onClick={handlePrint}>
            🖨️ Print Invoice
          </Button>
        </div>

        {/* Invoice Card */}
        <Card className="shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--pastel-green) 0%, var(--pastel-green-dark) 100%)',
            padding: '40px',
            color: 'white'
          }}>
            <Row className="align-items-center">
              <Col md={6}>
                <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '10px' }}>
                  🏠 RENT-IT
                </h1>
                <p style={{ fontSize: '18px', opacity: 0.9, margin: 0 }}>
                  Rental Invoice
                </p>
              </Col>
              <Col md={6} className="text-md-end">
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>
                  INVOICE
                </h2>
                <p style={{ fontSize: '20px', margin: 0 }}>
                  #{bill.billNo}
                </p>
                <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                  Date: {new Date(bill.billDate).toLocaleDateString('en-IN')}
                </p>
              </Col>
            </Row>
          </div>

          <Card.Body className="p-5">
            {/* Customer & Owner Info */}
            <Row className="mb-5">
              <Col md={6}>
                <div className="p-4" style={{ 
                  background: '#f8f9fa', 
                  borderRadius: '16px',
                  border: '2px solid var(--border-color)'
                }}>
                  <h5 style={{ 
                    color: 'var(--pastel-green-dark)', 
                    fontWeight: '700',
                    marginBottom: '20px',
                    fontSize: '18px'
                  }}>
                    👤 CUSTOMER DETAILS
                  </h5>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Name:</strong> {bill.customer.fullName}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Email:</strong> {bill.customer.email}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Phone:</strong> {bill.customer.phoneNo}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Address:</strong> {bill.customer.address}
                  </p>
                  <p style={{ marginBottom: 0, fontSize: '15px' }}>
                    <strong>City, State:</strong> {bill.customer.city}, {bill.customer.state}
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="p-4" style={{ 
                  background: '#f8f9fa', 
                  borderRadius: '16px',
                  border: '2px solid var(--border-color)'
                }}>
                  <h5 style={{ 
                    color: 'var(--pastel-green-dark)', 
                    fontWeight: '700',
                    marginBottom: '20px',
                    fontSize: '18px'
                  }}>
                    🏢 OWNER DETAILS
                  </h5>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Name:</strong> {bill.owner.fullName}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Email:</strong> {bill.owner.email}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Phone:</strong> {bill.owner.phoneNo}
                  </p>
                  <p style={{ marginBottom: 0, fontSize: '15px' }}>
                    <strong>Address:</strong> {bill.owner.address}
                  </p>
                </div>
              </Col>
            </Row>

            {/* Item Details */}
            <div className="mb-4">
              <h5 style={{ 
                color: 'var(--pastel-green-dark)', 
                fontWeight: '700',
                marginBottom: '20px',
                fontSize: '20px'
              }}>
                📦 RENTAL ITEM DETAILS
              </h5>
              <Table bordered hover style={{ fontSize: '15px' }}>
                <thead style={{ background: 'var(--pastel-green-light)' }}>
                  <tr>
                    <th>Item Name</th>
                    <th>Brand</th>
                    <th>Description</th>
                    <th>Condition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>{bill.item.itemName}</strong></td>
                    <td>{bill.item.brand}</td>
                    <td>{bill.item.description}</td>
                    <td>{bill.item.condition}</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            {/* Rental Period */}
            <div className="mb-4">
              <h5 style={{ 
                color: 'var(--pastel-green-dark)', 
                fontWeight: '700',
                marginBottom: '20px',
                fontSize: '20px'
              }}>
                📅 RENTAL PERIOD
              </h5>
              <Row>
                <Col md={4}>
                  <div className="p-3 text-center" style={{ 
                    background: '#e8f5e9', 
                    borderRadius: '12px',
                    border: '2px solid #c8e6c9'
                  }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Start Date</p>
                    <h4 style={{ margin: '8px 0', color: '#2e7d32', fontWeight: '700' }}>
                      {new Date(bill.rental.startDate).toLocaleDateString('en-IN')}
                    </h4>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="p-3 text-center" style={{ 
                    background: '#fff3e0', 
                    borderRadius: '12px',
                    border: '2px solid #ffe0b2'
                  }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>End Date</p>
                    <h4 style={{ margin: '8px 0', color: '#f57c00', fontWeight: '700' }}>
                      {new Date(bill.rental.endDate).toLocaleDateString('en-IN')}
                    </h4>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="p-3 text-center" style={{ 
                    background: '#e3f2fd', 
                    borderRadius: '12px',
                    border: '2px solid #bbdefb'
                  }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Days</p>
                    <h4 style={{ margin: '8px 0', color: '#1976d2', fontWeight: '700' }}>
                      {bill.rental.numberOfDays} Days
                    </h4>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Bill Breakdown */}
            <div className="mb-4">
              <h5 style={{ 
                color: 'var(--pastel-green-dark)', 
                fontWeight: '700',
                marginBottom: '20px',
                fontSize: '20px'
              }}>
                💰 BILLING SUMMARY
              </h5>
              <Table bordered style={{ fontSize: '16px' }}>
                <tbody>
                  <tr>
                    <td><strong>Rent per Day</strong></td>
                    <td className="text-end">₹{bill.item.rentPerDay}</td>
                  </tr>
                  <tr>
                    <td><strong>Number of Days</strong></td>
                    <td className="text-end">{bill.rental.numberOfDays}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Rent</strong></td>
                    <td className="text-end">₹{bill.rental.totalRent}</td>
                  </tr>
                  <tr>
                    <td><strong>Security Deposit</strong></td>
                    <td className="text-end">₹{bill.rental.deposit}</td>
                  </tr>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, var(--pastel-green-light) 0%, var(--pastel-green) 100%)',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    <td><strong>GRAND TOTAL</strong></td>
                    <td className="text-end"><strong>₹{bill.rental.grandTotal}</strong></td>
                  </tr>
                </tbody>
              </Table>
            </div>

            {/* Footer */}
            <div className="text-center pt-4" style={{ 
              borderTop: '2px dashed var(--border-color)',
              marginTop: '40px'
            }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Thank you for using Rent-It!
              </p>
              <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
                For any queries, please contact us at support@rentit.com
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BillInvoice;