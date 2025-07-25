import React from 'react';
import "../styles/Profile.css";

const Profile = () => {
  // Dummy user data for now. Later we can pull from API.
  const user = {
    username: 'ehab_kayyali',
    email: 'ehab@email.com',
    joined: 'July 2025',
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div className="profile-details">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Member Since:</strong> {user.joined}</p>
      </div>
    </div>
  );
};

export default Profile;
