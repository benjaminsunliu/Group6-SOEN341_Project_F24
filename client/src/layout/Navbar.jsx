import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Navbar = (props) => {

  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from cookies
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role); // Set user role from the decoded token
      setUserName(`${decodedToken.fName} ${decodedToken.lName}`);
    } else {
      // Not sure if we need anything here
    }
  }, [navigate]);
  
  const logoutHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5050/api/logout", {}, { withCredentials: true });
      console.log("Server Response:", response);
      if (response.status === 200) {
        alert("Logged out successfully!");
        // Redirect to login page or refresh the page
        window.location.href = "/login"; // Adjust the URL to your login page
      } else {
        alert(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out. Please try again.");
    }
  };
  
  
  const renderCustomNavbar = () => {
    switch(userRole) {
      case 'student': 
        return(
          <>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <Link class="nav-link active" aria-current="page" to="/">
              Home
            </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/student-dashboard">
              Student Dashboard
            </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" onClick={logoutHandler}>
              Log Out
            </Link>
          </li>
          </ul>
          Logged in as: {userName}
          </>
        );
      case 'instructor':
        return(
          <>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <Link class="nav-link active" aria-current="page" to="/">
              Home
            </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/instructor-dashboard">
              Instructor Dashboard
            </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" onClick={logoutHandler}>
              Log Out
            </Link>
          </li>
          </ul>
          Logged in as: {userName}
          </>
        );
        default:
          return(
            <>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
            <Link class="nav-link active" aria-current="page" to="/">
              Home
            </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/create-account">
                Create Account
              </Link>
            </li>
            </ul>
            Logged out
            </>
          );
    }
  }
  
  return (
    <>
      <nav class="navbar bg-primary navbar-expand-lg ">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            RateMyChillmates
            <img src="/images/logo.png" alt="logo" width="50px"/>
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            
            {renderCustomNavbar()}
              {/*<li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" aria-disabled="true">
                  Disabled
                </a>
              </li>*/}
            {/*<form class="d-flex" role="search">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button class="btn btn-warning" type="submit">
                Search
              </button>
            </form>*/}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
