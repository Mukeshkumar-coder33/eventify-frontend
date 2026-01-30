import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import API from '../api/axios';
import AuthContext from '../context/AuthContext';

const ConcertEvents = () => {
    const { user } = useContext(AuthContext);
    const [concerts, setConcerts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedConcert, setSelectedConcert] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        pricing: { gold: '', platinum: '', diamond: '' }
    });
    const [bookingDetails, setBookingDetails] = useState({
        ticketCategory: 'gold',
        name: '',
        address: ''
    });

    const fetchConcerts = async () => {
        try {
            const { data } = await API.get('/api/concert-events');
            setConcerts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchConcerts();
    }, []);

    const openBooking = (concert) => {
        setSelectedConcert(concert);
        setShowBookingModal(true);
    };

    const openEdit = (concert) => {
        setFormData({
            name: concert.name,
            location: concert.location,
            description: concert.description,
            pricing: concert.pricing
        });
        setEditingId(concert._id);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await API.put(`/api/concert-events/${editingId}`, formData);
            } else {
                const payload = {
                    ...formData,
                    pricing: {
                        gold: Number(formData.pricing.gold),
                        platinum: Number(formData.pricing.platinum),
                        diamond: Number(formData.pricing.diamond)
                    }
                };
                await API.post('/api/concert-events', payload);
            }
            setShowModal(false);
            setFormData({ name: '', location: '', description: '', pricing: { gold: '', platinum: '', diamond: '' } });
            setEditingId(null);
            fetchConcerts();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error saving concert event');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this concert event?')) {
            try {
                await API.delete(`/api/concert-events/${id}`);
                fetchConcerts();
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || 'Error deleting concert event');
            }
        }
    };

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastPayment, setLastPayment] = useState(null);

    // Load Razorpay Script
    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async () => {
        const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const amount = selectedConcert.pricing[bookingDetails.ticketCategory];

        try {
            // 1. Create Order
            const { data: order } = await API.post('/api/payments/order', { amount });

            const options = {
                key: "rzp_test_S9wsPk9p9MqMje", // Use process.env in real app (Vite req)
                amount: order.amount,
                currency: order.currency,
                name: "Eventify",
                description: `Ticket for ${selectedConcert.name}`,
                order_id: order.id,
                handler: async function (response) {
                    // 2. Verify Payment
                    const paymentData = {
                        concertEventId: selectedConcert._id,
                        ticketCategory: bookingDetails.ticketCategory,
                        amount,
                        customerDetails: {
                            name: bookingDetails.name,
                            address: bookingDetails.address
                        }
                    };

                    try {
                        const verifyRes = await API.post('/api/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            paymentData
                        });

                        setLastPayment({ ...paymentData, eventName: selectedConcert.name, date: new Date().toLocaleDateString(), razorpayPaymentId: response.razorpay_payment_id });
                        setShowBookingModal(false);
                        setShowSuccessModal(true);
                        setBookingDetails({ ticketCategory: 'gold', name: '', address: '' });

                    } catch (error) {
                        alert("Payment Verification Failed: " + (error.response?.data?.message || 'Unknown Error'));
                    }
                },
                prefill: {
                    name: bookingDetails.name,
                    contact: "9999999999", // Placeholder or ask user
                    email: user.email // User email from context
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert("Error creating order: " + (error.response?.data?.message || error.message));
        }
    };



    const downloadReceipt = () => {
        if (!lastPayment) return;
        const receiptContent = `
        EVENTIFY RECEIPT
        ----------------
        Event: ${lastPayment.eventName}
        Date: ${lastPayment.date}
        Customer: ${lastPayment.customerDetails.name}
        Ticket: ${lastPayment.ticketCategory.toUpperCase()}
        Amount Paid: ₹${lastPayment.amount}
        ----------------
        Thank you for booking with Eventify!
        Please show this receipt at the venue.
        `;

        const element = document.createElement("a");
        const file = new Blob([receiptContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Receipt_${lastPayment.eventName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="full-width-section" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
                    <div className="content-container">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="fw-bold text-white">Concert Events</h2>
                            {user && (
                                <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => { setEditingId(null); setFormData({ name: '', location: '', description: '', pricing: { gold: '', platinum: '', diamond: '' } }); setShowModal(true); }}>
                                    <FaPlus className="me-2" /> Create Concert Event
                                </Button>
                            )}
                        </div>

                        <Row className="g-4 justify-content-center">
                            {concerts.map(concert => (
                                <Col xs={12} md={6} lg={4} key={concert._id}>
                                    <Card className="h-100 light-glass-card border-0 shadow-lg overflow-hidden hover-lift" style={{ transition: 'transform 0.3s ease' }}>
                                        {/* Concert Header with Gradient Banner */}
                                        <div className="position-relative" style={{
                                            background: 'linear-gradient(135deg, #FF6B6B 0%, #556270 100%)',
                                            padding: '2rem 1.5rem',
                                            minHeight: '140px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}>
                                            <h3 className="text-white fw-bold mb-2 text-center" style={{
                                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                                fontSize: '1.5rem',
                                                lineHeight: '1.3'
                                            }}>
                                                {concert.name}
                                            </h3>
                                            <div className="d-flex align-items-center justify-content-center text-white" style={{ opacity: 0.95 }}>
                                                <FaMapMarkerAlt className="me-2" size={14} />
                                                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{concert.location}</span>
                                            </div>

                                            {/* Edit/Delete buttons for creator */}
                                            {user && concert.user && user._id === concert.user._id && (
                                                <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                                                    <div
                                                        className="bg-white bg-opacity-25 rounded-circle p-2"
                                                        style={{ cursor: 'pointer', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        onClick={() => openEdit(concert)}
                                                        title="Edit Concert"
                                                    >
                                                        <FaEdit className="text-white" size={14} />
                                                    </div>
                                                    <div
                                                        className="bg-white bg-opacity-25 rounded-circle p-2"
                                                        style={{ cursor: 'pointer', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        onClick={() => handleDelete(concert._id)}
                                                        title="Delete Concert"
                                                    >
                                                        <FaTrash className="text-white" size={14} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <Card.Body className="d-flex flex-column p-4">
                                            {/* Description */}
                                            <div className="mb-4">
                                                <h6 className="text-secondary fw-bold mb-2" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    Event Details
                                                </h6>
                                                <p className="text-dark mb-0" style={{ opacity: 0.9, lineHeight: '1.6', fontSize: '0.95rem' }}>
                                                    {concert.description}
                                                </p>
                                            </div>

                                            {/* Pricing Section */}
                                            <div className="mb-4">
                                                <h6 className="text-secondary fw-semibold mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    Ticket Pricing
                                                </h6>
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-warning bg-opacity-25 rounded px-2 py-1 me-2">
                                                                <span className="text-warning fw-bold" style={{ fontSize: '0.75rem' }}>GOLD</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-dark fw-bold" style={{ fontSize: '1.1rem' }}>₹{concert.pricing.gold}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ background: 'rgba(192, 192, 192, 0.2)' }}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-secondary bg-opacity-25 rounded px-2 py-1 me-2">
                                                                <span className="text-secondary fw-bold" style={{ fontSize: '0.75rem' }}>PLATINUM</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-dark fw-bold" style={{ fontSize: '1.1rem' }}>₹{concert.pricing.platinum}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ background: 'rgba(0, 191, 255, 0.1)' }}>
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-info bg-opacity-25 rounded px-2 py-1 me-2">
                                                                <span className="text-info fw-bold" style={{ fontSize: '0.75rem' }}>DIAMOND</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-dark fw-bold" style={{ fontSize: '1.1rem' }}>₹{concert.pricing.diamond}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Organizer Info */}
                                            <div className="mb-4 p-3 rounded" style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                                        style={{ width: '40px', height: '40px' }}>
                                                        <span className="text-white fw-bold">{concert.user?.name?.charAt(0) || 'O'}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-secondary mb-0 fw-semibold" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                                            Organized by
                                                        </p>
                                                        <p className="text-dark mb-0 fw-bold" style={{ fontSize: '1rem' }}>
                                                            {concert.user?.name || 'Unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Book Now Button */}
                                            <Button
                                                variant="outline-dark"
                                                className="w-100 rounded-pill fw-bold py-2 mt-auto"
                                                onClick={() => openBooking(concert)}
                                                style={{
                                                    fontSize: '1rem',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                🎫 Book Tickets Now
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Create/Edit Concert Modal */}
                        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                            <Modal.Header closeButton className="border-0">
                                <Modal.Title>{editingId ? 'Edit Concert Event' : 'Create Concert Event'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Event Name</Form.Label>
                                        <Form.Control type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Rock Concert 2026" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Madison Square Garden" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Event details..." />
                                    </Form.Group>

                                    <h6 className="mb-3">Pricing Tiers (in ₹)</h6>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Gold</Form.Label>
                                                <Form.Control type="number" value={formData.pricing.gold} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, gold: e.target.value } })} placeholder="500" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Platinum</Form.Label>
                                                <Form.Control type="number" value={formData.pricing.platinum} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, platinum: e.target.value } })} placeholder="1000" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Diamond</Form.Label>
                                                <Form.Control type="number" value={formData.pricing.diamond} onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, diamond: e.target.value } })} placeholder="2000" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer className="border-0">
                                <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button variant="primary" onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
                            </Modal.Footer>
                        </Modal>

                        {/* Booking Modal */}
                        <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered size="lg">
                            <Modal.Header closeButton className="border-0">
                                <Modal.Title>Book Tickets: {selectedConcert?.name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="p-4">
                                <Row>
                                    <Col md={7}>
                                        <h5 className="mb-3">Enter Details</h5>
                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Ticket Category</Form.Label>
                                                <Form.Select
                                                    value={bookingDetails.ticketCategory}
                                                    onChange={(e) => setBookingDetails({ ...bookingDetails, ticketCategory: e.target.value })}
                                                    className="form-control text-dark"
                                                >
                                                    <option value="gold">Gold (₹{selectedConcert?.pricing.gold})</option>
                                                    <option value="platinum">Platinum (₹{selectedConcert?.pricing.platinum})</option>
                                                    <option value="diamond">Diamond (₹{selectedConcert?.pricing.diamond})</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Name"
                                                    value={bookingDetails.name}
                                                    onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    placeholder="Enter Address"
                                                    value={bookingDetails.address}
                                                    onChange={(e) => setBookingDetails({ ...bookingDetails, address: e.target.value })}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                    <Col md={5} className="text-center border-start">
                                        <h5 className="mb-3">Payment</h5>
                                        <div className="bg-light p-3 rounded mb-3 text-center">
                                            <p className="text-muted mb-0">Secure Payment via Razorpay</p>
                                        </div>
                                        <div className="d-grid gap-2">
                                            <div className="h4 mb-3">
                                                Total: <span className="text-primary fw-bold">₹{selectedConcert && selectedConcert.pricing[bookingDetails.ticketCategory]}</span>
                                            </div>
                                            <Button variant="info" size="lg" className="text-white" onClick={handleRazorpayPayment}>
                                                Pay with Razorpay
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Body className="text-center p-5">
                    <div className="mb-4">
                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px', fontSize: '40px' }}>
                            ✓
                        </div>
                    </div>
                    <h2 className="fw-bold mb-3">Payment Successful!</h2>
                    <p className="text-muted mb-4">You have successfully booked tickets for <strong>{lastPayment?.eventName}</strong>.</p>
                    <div className="d-grid gap-3">
                        <Button variant="primary" size="lg" onClick={downloadReceipt}>
                            📥 Download Receipt
                        </Button>
                        <Button variant="outline-secondary" onClick={() => setShowSuccessModal(false)}>
                            Close
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Full-Width Footer */}
            <footer className="footer-glass">
                <div className="footer-content">
                    <Row className="align-items-center">
                        <Col md={4} className="mb-3 mb-md-0 text-md-start text-center">
                            <h4 className="text-white fw-bold mb-2">Eventify</h4>
                            <p className="text-white mb-0" style={{ opacity: 0.8 }}>Making every moment count.</p>
                        </Col>
                        <Col md={4} className="mb-3 mb-md-0 text-center">
                            <h6 className="text-white text-uppercase fw-bold mb-3" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>Quick Links</h6>
                            <div className="d-flex flex-column gap-2">
                                <Link to="/" className="text-white text-decoration-none" style={{ opacity: 0.8, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.8}>Home</Link>
                                <Link to="/personal-events" className="text-white text-decoration-none" style={{ opacity: 0.8, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.8}>Personal Events</Link>
                                <Link to="/concert-events" className="text-white text-decoration-none" style={{ opacity: 0.8, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.8}>Concert Events</Link>
                            </div>
                        </Col>
                        <Col md={4} className="text-md-end text-center">
                            <p className="text-white mb-2" style={{ opacity: 0.8 }}>© 2026 Eventify. All rights reserved.</p>
                            <p className="text-white mb-2" style={{ opacity: 0.8 }}>Designed with <FaHeart className="text-danger" style={{ display: 'inline' }} /></p>
                            <p className="text-white mb-0" style={{ opacity: 0.8 }}>Developed by Mukesh kumar</p>
                        </Col>
                    </Row>
                </div>
            </footer>
        </>
    );
};

export default ConcertEvents;
