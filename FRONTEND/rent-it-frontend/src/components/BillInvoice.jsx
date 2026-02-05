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
      
      console.log('=== BILL DETAILS DEBUG ===');
      console.log('Response Data:', response.data);
      console.log('=========================');
      
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

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
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

  // Extract data from NESTED structure
  const billNumber = bill.billNo || 'N/A';
  const billDate = bill.billDate || new Date();
  
  // Date fields from rental object
  const startDate = bill.rental?.startDate;
  const endDate = bill.rental?.endDate;
  const numberOfDays = bill.rental?.numberOfDays || 1;
  
  // Financial details from rental and item objects
  const rentPerDay = bill.item?.rentPerDay || 0;
  const totalRent = bill.rental?.totalRent || (rentPerDay * numberOfDays);
  const depositAmt = bill.rental?.deposit || 0;
  const grandTotal = bill.rental?.grandTotal || (totalRent + depositAmt);
  
  // Customer details from nested customer object
  const customerName = bill.customer?.fullName || 'N/A';
  const customerEmail = bill.customer?.email || 'N/A';
  const customerPhone = bill.customer?.phoneNo || 'N/A';
  const customerAddress = bill.customer?.address || 'N/A';
  const customerCity = bill.customer?.city || 'N/A';
  const customerState = bill.customer?.state || 'N/A';

  // Owner details from nested owner object
  const ownerName = bill.owner?.fullName || 'N/A';
  const ownerEmail = bill.owner?.email || 'N/A';
  const ownerPhone = bill.owner?.phoneNo || 'N/A';
  const ownerAddress = bill.owner?.address || 'N/A';
  const ownerCity = bill.owner?.city || 'N/A';
  const ownerState = bill.owner?.state || 'N/A';

  // Item details from nested item object
  const itemName = bill.item?.itemName || 'N/A';
  const itemBrand = bill.item?.brand || 'N/A';
  const itemDescription = bill.item?.description || 'N/A';
  const itemCondition = bill.item?.condition || 'N/A';

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
                  #{billNumber}
                </p>
                <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                  Date: {formatDate(billDate)}
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
                    <strong>Name:</strong> {customerName}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Email:</strong> {customerEmail}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Phone:</strong> {customerPhone}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Address:</strong> {customerAddress}
                  </p>
                  <p style={{ marginBottom: 0, fontSize: '15px' }}>
                    <strong>City, State:</strong> {customerCity}, {customerState}
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
                    <strong>Name:</strong> {ownerName}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Email:</strong> {ownerEmail}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Phone:</strong> {ownerPhone}
                  </p>
                  <p style={{ marginBottom: '8px', fontSize: '15px' }}>
                    <strong>Address:</strong> {ownerAddress}
                  </p>
                  <p style={{ marginBottom: 0, fontSize: '15px' }}>
                    <strong>City, State:</strong> {ownerCity}, {ownerState}
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
                    <td><strong>{itemName}</strong></td>
                    <td>{itemBrand}</td>
                    <td>{itemDescription}</td>
                    <td>{itemCondition}</td>
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
                      {formatDate(startDate)}
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
                      {formatDate(endDate)}
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
                      {numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'}
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
                    <td className="text-end">₹{rentPerDay.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td><strong>Number of Days</strong></td>
                    <td className="text-end">{numberOfDays}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Rent</strong></td>
                    <td className="text-end">₹{totalRent.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td><strong>Security Deposit</strong></td>
                    <td className="text-end">₹{depositAmt.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, var(--pastel-green-light) 0%, var(--pastel-green) 100%)',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    <td><strong>GRAND TOTAL</strong></td>
                    <td className="text-end"><strong>₹{grandTotal.toLocaleString('en-IN')}</strong></td>
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