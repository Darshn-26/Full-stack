import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  // Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from local storage
    navigate("/");
  };

  if (!user) {
    // Redirect to login if no user data is found
    navigate("/");
    return null;
  }

  return (
    <div className="home-container">
      <div className="welcome-section">
        {user.profilePic && <img src={user.profilePic} alt="Profile" className="profile-pic" />}
        <div className="user-info">
          <h1>Welcome back, {user.name || user.username}!</h1> {/* Display username */}
          <p className="user-email">{user.email}</p> {/* Display email */}
        </div>
        <p>We’re glad to see you again. Explore our features and manage your account.</p>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button> {/* Updated button */}
        <button className="btn btn-secondary" onClick={() => navigate('/settings')}>Settings</button>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;
