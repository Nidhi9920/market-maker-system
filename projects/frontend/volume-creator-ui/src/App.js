import React, { useState } from 'react';
import axios from 'axios';
import { Spinner, Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [distributionNumber, setDistributionNumber] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to add logs with timestamps
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog([...log, `${timestamp} - ${message}`]);
  };

  // Handler for volume creation
  const createVolume = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/volume', {
        distributionNumber: parseInt(distributionNumber),
        totalTransactions: parseInt(totalTransactions),
      });
      addLog(`Volume created successfully: ${response.data[0].message}`);
    } catch (error) {
      addLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for collecting remaining SOL
  const collectSol = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/collectSol');
      addLog(`SOL collected successfully: ${response.data[0].message}`);
    } catch (error) {
      addLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for closing SPL token accounts
  const closeSplAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/closeSpl');
      addLog(`SPL token accounts closed: ${response.data[0].message}`);
    } catch (error) {
      addLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
      <h1 className="mb-5 text-primary">Market Maker Founder Tool</h1>

      {/* Volume Creation Section */}
      <Row className="mb-4 w-100">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">Volume Creation</Card.Title>
              <Form>
                <Form.Group className="mb-3" controlId="formDistributionNumber">
                  <Form.Label>Distribution Number (Wallets)</Form.Label>
                  <Form.Control
                    type="number"
                    value={distributionNumber}
                    onChange={(e) => setDistributionNumber(e.target.value)}
                    placeholder="Enter number of wallets"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTotalTransactions">
                  <Form.Label>Total Transactions (Buy/Sell Orders)</Form.Label>
                  <Form.Control
                    type="number"
                    value={totalTransactions}
                    onChange={(e) => setTotalTransactions(e.target.value)}
                    placeholder="Enter total transactions"
                  />
                </Form.Group>

                <Button variant="primary" onClick={createVolume} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Create Volume'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Remaining SOL Collection Section */}
      <Row className="mb-4 w-100">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-success">Collect Remaining SOL</Card.Title>
              <Button variant="success" onClick={collectSol} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Collect SOL'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* SPL Account Closure Section */}
      <Row className="mb-4 w-100">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-danger">Close SPL Token Accounts</Card.Title>
              <Button variant="danger" onClick={closeSplAccounts} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Close SPL Accounts'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
