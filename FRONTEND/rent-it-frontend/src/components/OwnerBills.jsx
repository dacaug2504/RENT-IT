

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Table, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { billService } from "../services/api";
import { motion } from "framer-motion";

const OwnerBills = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOwnerBills();
  }, []);

  const fetchOwnerBills = async () => {
    try {
      setLoading(true);
      const response = await billService.getOwnerBills();
      setBills(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Loading your bills...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2>💰 Rental Income</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {bills.length === 0 ? (
        <Card className="p-5 text-center">
          <h4>No Rental Income Yet</h4>
        </Card>
      ) : (
        <Card>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Item</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <motion.tr
                  key={bill.billNo}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td>
                    <Badge bg="info">#{bill.billNo}</Badge>
                  </td>
                  <td>{bill.item}</td>
                  <td>{bill.customer}</td>
                  <td>₹{bill.amount}</td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/bill/${bill.billNo}`)}
                    >
                      View
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
};

export default OwnerBills;
