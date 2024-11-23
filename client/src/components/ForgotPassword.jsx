// src/components/ForgotPassword.jsx
import { useState } from 'react';
import axios from 'axios';

//forgotPassword method
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setMessage('');

    //running via a localhost !!
    try {
      const response = await axios.post('http://localhost:5050/api/request-reset-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Requesting password reset');
    }
  };
  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      <form onSubmit={handlePasswordResetRequest}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />      
        <button type="submit">Request Password Reset</button>
      </form>
      {message && <p>{message}</p>}
      <button type="button" onClick={() => window.location.reload()} className="btn-link">
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;
