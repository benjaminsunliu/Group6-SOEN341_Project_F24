import { Link, useNavigate} from "react-router-dom";
import { useState, useEffect} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token"); // Get the token from cookies
    if (token) {
      alert("You are already logged in!");
      navigate("/");
    }
  }, [navigate]);


  const loginFunc = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      alert("Please fill out all fields.");
      return;
  }

    try {
      // Basic form validation

      const response = await axios.post('http://localhost:5050/api/login', {
        email,
        password,
      }, {
        withCredentials: true // Important: allows cookies to be sent with the request
      });

      const role = response.data.role;

      // Redirect based on user role
      if (role === 'instructor') {
        alert("Successfully logged in as an instructor!");
        navigate('/instructor-dashboard');
      } else {
        alert("Successfully logged in as a student!");
        navigate('/student-dashboard'); // Redirect to a different page for non-instructor roles
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div class="body" >
      <main className="body" class="body">
        <form>
          <h1 class="h3 mb-3 fw-normal">Please login</h1>

          <div class="form-floating">
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)} 
            />
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label for="floatingPassword">Password</label>
          </div>

          <div class="form-check text-start my-3">
            <input
              class="form-check-input"
              type="checkbox"
              value="remember-me"
              id="flexCheckDefault"
            />
            <label class="form-check-label" for="flexCheckDefault">
              Remember me
            </label>
          </div>
          <button class="btn btn-primary w-100 py-2" type="submit" onClick = {loginFunc}>
            Login
          </button>
          <br/>
          <br/>
          <Link class="nav-link" to="/create-account">
                  New user? Create an account
          </Link>
          <p class="mt-5 mb-3 text-body-secondary">&copy; Fall 2024</p>
        </form>
      </main>
    </div>
  );
};

export default Login;