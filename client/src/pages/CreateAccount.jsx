import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";

const CreateAccount = (props) => {
    const navigate = useNavigate();  // Initialize useNavigate
    const [role, setRole] = useState('');  // State to store role

    // TODO: Set up create account on the server side
    const loginHandler = async (event) => {
        event.preventDefault();
        const fName = document.getElementById("fName").value;
        const lName = document.getElementById("lName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        // Basic form validation
        if (!email || !password || !fName || !lName || !role) {
            alert("Please fill out all fields.");
            return;
        }
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        // Password format validation (e.g., minimum 8 characters, at least one number)
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Password must be at least 8 characters long, contain at least one number, one lowercase and one uppercase letter.");
            return;
        }
    
        try {
            // Send the POST request to the server
            const response = await axios.post("http://localhost:5050/api/create-account", {
                fName,
                lName,
                email,
                password,
                role,
            });
    
            // Log response to check the status
            console.log('Server Response:', response);
    
            // Check for successful account creation
            if (response.status === 201) {
                alert("Account created successfully!");
    
                // Redirect to the login page after successful account creation
                navigate("/login");
            } else {
                alert(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            // Log the error for debugging
            console.error("Error creating account:", error);
    
            if (error.response && error.response.status === 409) {
                alert("Email already in use.");
            } else {
                alert("Error creating account. Please try again.");
            }
        }
    };

    return (
    <div class="container" style={{ padding: "13% 0%" }}>
        <main class="form-signin m-auto" style={{ width: "25%" }}>
        <form /*</main>onSubmit={loginHandler}*/>
            <h1 class="h3 mb-3 fw-normal">Create an Account</h1>
            <div class="form-floating">
            <input
                type="text"
                class="form-control"
                id="fName"
                placeholder="First Name"

            />
            <label for="fName">Enter your first name</label>
            </div>
            <div class="form-floating">
            <input
                type="text"
                class="form-control"
                id="lName"
                placeholder="Last Name"
            />
            <label for="lName">Enter your last name</label>
            </div>
            <div class="form-floating">
            <input
                type="email"
                class="form-control"
                id="email"
                placeholder="name@example.com"

            />
            <label for="email">Enter your university email</label>
            </div>
            <div class="form-floating">
            <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"

            />
            <label for="password">Create a password</label>
            </div>
            <br/>
            {/* Role Selection via Radio Buttons */}
            <div>
                <label>Select your role:</label>
                <div>
                    <input 
                        type="radio" 
                        id="student" 
                        name="role" 
                        value="student" 
                        onChange={(e) => setRole(e.target.value)} 
                    />
                    <label htmlFor="student">Student</label>
                </div>
                <div>
                    <input 
                        type="radio" 
                        id="instructor" 
                        name="role" 
                        value="instructor" 
                        onChange={(e) => setRole(e.target.value)} 
                    />
                    <label htmlFor="instructor"> Instructor</label>
                </div>
            </div>
            <br/>
            <button class="btn btn-primary w-100 py-2" type="submit" onClick = {loginHandler}>
            Create Account
            </button>
            <br/>
            <br/>
            <Link class="nav-link" to="/login">
            Already have an account? Login
            </Link>
            <p class="mt-5 mb-3 text-body-secondary">&copy; Fall 2024</p>
        </form>
        </main>
    </div>
    );
    }

export default CreateAccount;