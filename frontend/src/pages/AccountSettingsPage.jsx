import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import '../styles/AccountSettingsPage.css';

const AccountSettingsPage = () => {
    const { user } = useAuth(); // We'll need the user's email for display

    // State for the email change form
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });

    // State for the password change form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const handleEmailChange = async (e) => {
        e.preventDefault();
        setEmailMessage({ type: '', text: '' });

        try {
            await apiClient.put('/users/me/email', {
                new_email: newEmail,
                password: emailPassword,
            });
            setEmailMessage({ type: 'success', text: 'Email updated successfully! Please log in again with your new email.' });
            // In a real app, you might force a logout here.
            setNewEmail('');
            setEmailPassword('');
        } catch (err) {
            setEmailMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update email.' });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        try {
            await apiClient.put('/users/me/password', {
                current_password: currentPassword,
                new_password: newPassword,
            });
            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPasswordMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update password.' });
        }
    };

    return (
        <div className="account-settings-container">
            <header className="account-settings-header">
                <h1>Account Settings</h1>
                <a href="#/dashboard" className="back-link">← Back to Dashboard</a>
            </header>

            <div className="settings-section">
                <h2>Change Email</h2>
                <form onSubmit={handleEmailChange} className="settings-form">
                    <div className="form-group">
                        <label htmlFor="new-email">New Email</label>
                        <input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email-password">Confirm with Current Password</label>
                        <input id="email-password" type="password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} required />
                    </div>
                    {emailMessage.text && <p className={`message ${emailMessage.type}`}>{emailMessage.text}</p>}
                    <button type="submit" className="submit-button">Update Email</button>
                </form>
            </div>

            <div className="settings-section">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange} className="settings-form">
                    <div className="form-group">
                        <label htmlFor="current-password">Current Password</label>
                        <input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="new-password">New Password</label>
                        <input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm New Password</label>
                        <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    {passwordMessage.text && <p className={`message ${passwordMessage.type}`}>{passwordMessage.text}</p>}
                    <button type="submit" className="submit-button">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default AccountSettingsPage;
