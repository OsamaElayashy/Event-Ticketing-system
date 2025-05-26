import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          EventTick
        </Link>
        
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <Link to="/bookings" className="nav-link">
                My Bookings
              </Link>
              
              {user.role === 'organizer' && (
                <Link to="/my-events" className="nav-link">
                  My Events
                </Link>
              )}
              
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/events" className="nav-link">
                    Admin Events
                  </Link>
                  <Link to="/admin/users" className="nav-link">
                    Admin Users
                  </Link>
                </>
              )}
              
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;