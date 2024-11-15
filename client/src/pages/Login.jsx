// src/pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ForgotPassword from "../components/ForgotPassword"; // Import ForgotPassword component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to toggle ForgotPassword component
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      alert("You are already logged in!");
      navigate("/");
    }
  }, [navigate]);

  const loginFunc = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5050/api/login', { email, password }, { withCredentials: true });
      const role = response.data.role;

      if (role === 'instructor') {
        alert("Successfully logged in as an instructor!");
        navigate('/instructor-dashboard');
      } else {
        alert("Successfully logged in as a student!");
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="body">
      <main className="body">
        {!showForgotPassword ? ( // Toggle between Login form and ForgotPassword component
          <form onSubmit={loginFunc}>
            <h1 className="h3 mb-3 fw-normal">Please login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <button className="btn btn-primary w-100 py-2" type="submit">
              Login
            </button>
            <br />
            <br />
            <Link to="/create-account">New user? Create an account</Link>
            <br />
            <button type="button" onClick={() => setShowForgotPassword(true)} className="btn-link">
              Forgot Password?
            </button>
            <p className="mt-5 mb-3 text-body-secondary">&copy; Fall 2024</p>
          </form>
        ) : (
          <ForgotPassword /> // Display ForgotPassword component
        )}
      </main>
    </div>
  );
};

export default Login;
