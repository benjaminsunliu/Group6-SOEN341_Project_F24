import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ForgotPassword from "../components/ForgotPassword"; // Import ForgotPassword component

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
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
    setError("");

    if (!email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      // Basic form validation
      const response = await axios.post(
        "http://localhost:5050/api/login",
        { email, password },
        { withCredentials: true } // Allows cookies to be sent with the request
      );

      const role = response.data.role;

      // Redirect based on user role
      if (role === "instructor") {
        alert("Successfully logged in as an instructor!");
        navigate("/instructor-dashboard");
      } else {
        alert("Successfully logged in as a student!");
        navigate("/student-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <div class="body" className="body">
          {!showForgotPassword ? (
            <>
              <form onSubmit={loginFunc}>
                <h1 className="h3 mb-3 fw-normal">Please login</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}

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

                <div className="form-check text-start my-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="remember-me"
                    id="flexCheckDefault"
                  />
                  <label className="form-check-label" htmlFor="flexCheckDefault">
                    Remember me
                  </label>
                </div>
                <button className="btn btn-primary w-100 py-2" type="submit">
                  Login
                </button>
                <br />
                <br />
                <Link className="nav-link" to="/create-account">
                  New user? Create an account
                </Link>
                <br />
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="btn-link"
                >
                  Forgot Password?
                </button>

                <p className="mt-5 mb-3 text-body-secondary">&copy; Fall 2024</p>
              </form>
            </>
          ) : (
            <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
          )}
      </div>
    </>
  );
};

export default Login; // Ensure this is at the top-level
