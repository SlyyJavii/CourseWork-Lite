import React from 'react';
import '../styles/LandingPage.css';

const LandingPage = () => (
    <div className="landing-container">
        <h1 className="landing-title">Welcome to CourseWork Lite</h1>
        <p className="landing-subtitle">Your personal academic organizer. Please select an option below to begin.</p>
        <div className="landing-actions">
            <a href="#/login" className="button button-primary">
            Login
            </a>
            <a href="#/register" className="button button-secondary">
            Register
            </a>
        </div>
    </div>
);

export default LandingPage;