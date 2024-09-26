import { useState } from "react";
import { Link } from "react-router-dom";

const CreateAccount = (props) => {

    // TODO: Set up create account on the server side
    const loginHandler = () => {
        alert(`Created an account with name ${firstName} ${lastName}`);
    }

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
    <div class="container" style={{ padding: "13% 0%" }}>
        <main class="form-signin m-auto" style={{ width: "25%" }}>
        <form onSubmit={loginHandler}>
            <h1 class="h3 mb-3 fw-normal">Create an Account</h1>
            <div class="form-floating">
            <input
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="First Name"
                onChange = {e => setFirstName(e.target.value)}
            />
            <label for="floatingInput">Enter your first name</label>
            </div>
            <div class="form-floating">
            <input
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="Last Name"
                onChange = {e => setLastName(e.target.value)}
            />
            <label for="floatingInput">Enter your last name</label>
            </div>
            <div class="form-floating">
            <input
                type="email"
                class="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                onChange = {e => setEmail(e.target.value)}
            />
            <label for="floatingInput">Enter your university email</label>
            </div>
            <div class="form-floating">
            <input
                type="password"
                class="form-control"
                id="floatingPassword"
                placeholder="Password"
                onChange = {e => setPassword(e.target.value)}
            />
            <label for="floatingPassword">Create a password</label>
            </div>
            <br/>
            <button class="btn btn-primary w-100 py-2" type="submit">
            Create Student Account
            </button>
            <br/>
            <button class="btn btn-light w-100 py-2" type="submit">
            Create Instructor Account
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