import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaTrash, FaWhatsapp, FaInstagram, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const PersonalEvents = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        time: '',
        description: ''
    });

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/personal-events');
            setEvents(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSave = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingId) {
                await axios.put(`http://localhost:5000/api/personal-events/${editingId}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/api/personal-events', formData, config);
            }
            setShowModal(false);
            setFormData({ name: '', location: '', time: '', description: '' });
            setEditingId(null);
            fetchEvents();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/personal-events/${id}`, config);
                fetchEvents();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleRSVP = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`http://localhost:5000/api/personal-events/${id}/rsvp`, {}, config);

            // Update local state immediately
            setEvents(events.map(event => event._id === id ? data : event));
        } catch (error) {
            console.error(error);
        }
    };

    const shareEvent = (platform, event) => {
        const text = `Check out this event: ${event.name} at ${event.location} on ${event.time}!`;
        let url = '';
        if (platform === 'whatsapp') {
            url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        } else if (platform === 'instagram') {
            url = 'https://instagram.com';
        }
        window.open(url, '_blank');
    };

    const openEdit = (event) => {
        setFormData({ name: event.name, location: event.location, time: event.time, description: event.description });
        setEditingId(event._id);
        setShowModal(true);
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="full-width-section" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
                    <div className="content-container">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="fw-bold mb-0 text-white">Personal Events</h2>
                            <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => { setEditingId(null); setFormData({ name: '', location: '', time: '', description: '' }); setShowModal(true); }}>
                                <span className="me-2">+</span> Create Event
                            </Button>
                        </div>

                        <Row className="g-4 justify-content-center">
                            {events.map(event => (
                                <Col xs={12} md={6} lg={4} key={event._id}>
                                    <Card className="h-100 light-glass-card border-0 shadow-lg hover-lift" style={{ transition: 'transform 0.3s ease' }}>
                                        {/* Event Header with gradient */}
                                        <div className="position-relative" style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            padding: '1.5rem',
                                            borderRadius: '15px 15px 0 0'
                                        }}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="flex-grow-1">
                                                    <h4 className="text-white fw-bold mb-2">{event.name}</h4>
                                                    <div className="d-flex align-items-center text-white mb-1" style={{ opacity: 0.95 }}>
                                                        <FaCalendarAlt className="me-2" size={14} />
                                                        <span style={{ fontSize: '0.9rem' }}>{event.time}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center text-white" style={{ opacity: 0.95 }}>
                                                        <FaMapMarkerAlt className="me-2" size={14} />
                                                        <span style={{ fontSize: '0.9rem' }}>{event.location}</span>
                                                    </div>
                                                </div>
                                                {user && user._id === event.user._id && (
                                                    <div className="d-flex gap-2">
                                                        <div
                                                            className="bg-white bg-opacity-25 rounded-circle p-2"
                                                            style={{ cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            onClick={() => openEdit(event)}
                                                            title="Edit Event"
                                                        >
                                                            <FaEdit className="text-white" size={16} />
                                                        </div>
                                                        <div
                                                            className="bg-white bg-opacity-25 rounded-circle p-2"
                                                            style={{ cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            onClick={() => handleDelete(event._id)}
                                                            title="Delete Event"
                                                        >
                                                            <FaTrash className="text-white" size={16} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Card.Body className="d-flex flex-column p-4">
                                            <div className="mb-4">
                                                <h6 className="text-secondary fw-bold mb-2" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    About This Event
                                                </h6>
                                                <p className="text-dark mb-0" style={{ opacity: 0.9, lineHeight: '1.6', fontSize: '0.95rem' }}>
                                                    {event.description}
                                                </p>
                                            </div>

                                            {/* Host Info */}
                                            <div className="mb-4 p-3 rounded" style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                                        style={{ width: '40px', height: '40px' }}>
                                                        <span className="text-white fw-bold">{event.user?.name?.charAt(0) || 'U'}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-secondary mb-0 fw-semibold" style={{ fontSize: '0.85rem' }}>
                                                            Hosted by
                                                        </p>
                                                        <p className="text-dark mb-0 fw-bold" style={{ fontSize: '1rem' }}>
                                                            {event.user?.name || 'Unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RSVP Section */}
                                            <div className="mt-auto">
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="bg-success bg-opacity-25 rounded-circle p-2" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <span className="text-success fw-bold" style={{ fontSize: '0.85rem' }}>{event.rsvpUsers.length}</span>
                                                        </div>
                                                        <span className="text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>
                                                            {event.rsvpUsers.length === 1 ? 'person going' : 'people going'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-2 mb-3">
                                                    <Button
                                                        variant={event.rsvpUsers.includes(user._id) ? "success" : "outline-dark"}
                                                        className="flex-grow-1 rounded-pill fw-semibold"
                                                        onClick={() => handleRSVP(event._id)}
                                                        style={{ padding: '0.6rem' }}
                                                    >
                                                        {event.rsvpUsers.includes(user._id) ? "✓ I'm Going" : "RSVP Now"}
                                                    </Button>
                                                </div>

                                                {/* Share Buttons */}
                                                <div className="d-flex gap-2 justify-content-center pt-3 border-top" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                                                    <Button
                                                        variant="link"
                                                        className="text-success p-2"
                                                        onClick={() => shareEvent('whatsapp', event)}
                                                        title="Share on WhatsApp"
                                                    >
                                                        <FaWhatsapp size={24} />
                                                    </Button>
                                                    <Button
                                                        variant="link"
                                                        className="text-danger p-2"
                                                        onClick={() => shareEvent('instagram', event)}
                                                        title="Share on Instagram"
                                                    >
                                                        <FaInstagram size={24} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Create/Edit Modal */}
                        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                            <Modal.Header closeButton className="border-0">
                                <Modal.Title>{editingId ? 'Edit Event' : 'Create Event'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Event Name</Form.Label>
                                        <Form.Control type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Birthday Party" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Central Park" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date & Time</Form.Label>
                                        <Form.Control type="text" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="e.g., Jan 30, 2026 at 6 PM" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Event details..." />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer className="border-0">
                                <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button variant="primary" onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>

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

export default PersonalEvents;
