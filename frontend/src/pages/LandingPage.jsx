import React from 'react';

const LandingPage = () => (
    <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to CourseWork Lite</h1>
        <p className="text-lg mb-6">Your personal academic organizer.</p>
        <div>
            <a href="#/login" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors mx-2">Login</a>
            <a href="#/register" className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors mx-2">Register</a>
        </div>
    </div>
);

export default LandingPage;