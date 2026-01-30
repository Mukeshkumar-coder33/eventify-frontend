import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PersonalEvents from './pages/PersonalEvents';
import ConcertEvents from './pages/ConcertEvents';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar expand="lg" className="glass-navbar fixed-top" variant="dark">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="fw-bold">Eventify</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/personal-events">Personal Events</Nav.Link>
            <Nav.Link as={Link} to="/concert-events">Concert Events</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  Signed in as: <span className="fw-bold text-white">{user.name}</span>
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/personal-events"
            element={
              <ProtectedRoute>
                <PersonalEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/concert-events"
            element={
              // Concert events might be viewable by public, but booking requires auth? 
              // Request said "User can create concert events" implies auth.
              // "Only authenticated users can access event pages". 
              // So I'll protect it.
              <ProtectedRoute>
                <ConcertEvents />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
