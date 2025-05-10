import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const PaymentModal = ({ show, handleClose, booking, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically integrate with a payment gateway
      // For now, we'll simulate a successful payment
      const response = await axios.post('/booking/process-payment', {
        bookingId: booking._id,
        amount: booking.totalAmount,
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? cardDetails : null
      });

      if (response.data.success) {
        toast.success('Payment successful!');
        onPaymentSuccess();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h5>Booking Summary</h5>
          <p>Movie: {booking?.movie?.title}</p>
          <p>Amount: ${booking?.totalAmount}</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="upi">Paypal</option>
              <option value="netbanking">Net Banking</option>
            </Form.Select>
          </Form.Group>

          {paymentMethod === 'card' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  maxLength="19"
                  required
                />
              </Form.Group>

              <div className="row">
                <div className="col">
                  <Form.Group className="mb-3">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                      maxLength="5"
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col">
                  <Form.Group className="mb-3">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      maxLength="3"
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Name on Card</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  required
                />
              </Form.Group>
            </>
          )}

          {paymentMethod === 'upi' && (
            <Form.Group className="mb-3">
              <Form.Label>Paypal ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="example@upi"
                required
              />
            </Form.Group>
          )}

          {paymentMethod === 'netbanking' && (
            <Form.Group className="mb-3">
              <Form.Label>Select Bank</Form.Label>
              <Form.Select required>
                <option value="">Select your bank</option>
                <option value="sbi">Brac Bank</option>
                <option value="hdfc">IBBL Bank</option>
                <option value="icici">IFIC Bank</option>
                <option value="axis">South East Bank</option>
              </Form.Select>
            </Form.Group>
          )}

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Pay ${booking?.totalAmount}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal; 