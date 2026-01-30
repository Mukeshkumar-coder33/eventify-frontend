import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMusic, FaUsers, FaLock, FaBolt, FaHeart, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    return (
        <>
            <div className="page-wrapper">
                {/* Hero Section - Full Width */}
                <div className="full-width-section text-center py-5" style={{
                    background: 'radial-gradient(circle at center, rgba(118, 75, 162, 0.4) 0%, rgba(0,0,0,0) 70%)',
                    minHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    paddingTop: '100px'
                }}>
                    <div className="content-container">
                        <span className="badge border border-light text-white bg-transparent rounded-pill px-3 py-2 mb-4 fw-bold shadow-sm">🚀 The Future of Event Management</span>
                        <h1 className="display-1 fw-bold mb-4 text-white" style={{
                            textShadow: '0 0 20px rgba(0,0,0,0.5)',
                            letterSpacing: '-2px'
                        }}>
                            Eventify Your Life
                        </h1>
                        <p className="lead fs-3 text-light-custom mb-5 mx-auto" style={{ maxWidth: '800px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            Creativity meets organization. Whether it's an intimate gathering or a stadium tour,
                            Eventify provides the tools you need to make it legendary.
                        </p>
                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            <Link to="/register">
                                <Button variant="primary" size="lg" className="px-5 py-3 rounded-pill fw-bold shadow-lg text-uppercase d-flex align-items-center gap-2">
                                    Get Started <FaArrowRight />
                                </Button>
                            </Link>
                            <Link to="/concert-events">
                                <Button variant="outline-light" size="lg" className="px-5 py-3 rounded-pill fw-bold text-uppercase shadow-lg">
                                    Explore Events
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us Section - Full Width */}
                <div className="full-width-section mb-5 pb-5">
                    <div className="content-container">
                        <Row className="text-center mb-5">
                            <Col>
                                <h2 className="display-4 fw-bold text-white mb-3">Why Choose Eventify?</h2>
                                <p className="text-white fs-5">We combine power with simplicity for an unmatched experience.</p>
                            </Col>
                        </Row>
                        <Row className="g-4">
                            <Col md={4}>
                                <div className="glass-card p-4 h-100 feature-card text-center border-0">
                                    <div className="feature-icon-circle text-info" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <FaBolt />
                                    </div>
                                    <h3 className="fw-bold mb-3 text-white">Lightning Fast</h3>
                                    <p className="text-white">Create events in seconds. Our optimized platform ensures you spend less time managing and more time celebrating.</p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="glass-card p-4 h-100 feature-card text-center border-0">
                                    <div className="feature-icon-circle text-success" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <FaLock />
                                    </div>
                                    <h3 className="fw-bold mb-3 text-white">Secure Payments</h3>
                                    <p className="text-white">Your transactions are safe with us. We use simulated top-tier encryption standards for peace of mind.</p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="glass-card p-4 h-100 feature-card text-center border-0">
                                    <div className="feature-icon-circle text-danger" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <FaHeart />
                                    </div>
                                    <h3 className="fw-bold mb-3 text-white">Made with Love</h3>
                                    <p className="text-white">Designed for users, by users. We understand the nuances of hosting both small parties and massive concerts.</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Main Categories Section - Full Width */}
                <div className="full-width-section py-5" style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="content-container py-5">
                        <Row className="text-center mb-5">
                            <Col>
                                <h2 className="display-4 fw-bold text-white mb-3">Public & Private Events</h2>
                                <p className="text-white fs-5 mx-auto" style={{ maxWidth: '700px' }}>
                                    Choose your path. Host a private gathering for your inner circle or discover public concerts open to the world.
                                    Each experience is tailored to your needs.
                                </p>
                            </Col>
                        </Row>
                        <Row className="g-5">
                            <Col md={6}>
                                <Card className="h-100 glass-card border-0 p-4 transform-hover" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)' }}>
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="display-4 text-warning me-3"><FaUsers /></div>
                                            <div>
                                                <Card.Title as="h2" className="fw-bold mb-0 text-white">Personal Events</Card.Title>
                                                <Card.Subtitle className="text-white">Private & Exclusive</Card.Subtitle>
                                            </div>
                                        </div>
                                        <Card.Text className="fs-5 mb-4 text-light-custom" style={{ opacity: 0.9, lineHeight: '1.6' }}>
                                            Perfect for birthdays, weddings, or team meetups.
                                            You control the guest list. Friends can RSVP easily, and you can track real-time attendance numbers.
                                            Share your private link via WhatsApp or Instagram to get the party started.
                                        </Card.Text>
                                        <Link to="/personal-events">
                                            <Button variant="outline-light" className="rounded-pill px-4 fw-bold">Create Personal Event</Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="h-100 glass-card border-0 p-4 transform-hover" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)' }}>
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="display-4 text-info me-3"><FaMusic /></div>
                                            <div>
                                                <Card.Title as="h2" className="fw-bold mb-0 text-white">Concert Events</Card.Title>
                                                <Card.Subtitle className="text-white">Public & Ticketed</Card.Subtitle>
                                            </div>
                                        </div>
                                        <Card.Text className="fs-5 mb-4 text-light-custom" style={{ opacity: 0.9, lineHeight: '1.6' }}>
                                            Browse the latest concerts and shows nearby.
                                            Select from Gold, Platinum, or Diamond tiers.
                                            Our ticketing system handles payments securely (simulated) and sends instant confirmation.
                                        </Card.Text>
                                        <Link to="/concert-events">
                                            <Button variant="outline-light" className="rounded-pill px-4 fw-bold">Book Tickets</Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            {/* Footer - Full Width */}
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

export default Home;
