import { Link } from "react-router-dom";

const CreateAccount = (props) => {
return (
<div class="container" style={{ padding: "13% 0%" }}>
    <main class="form-signin m-auto" style={{ width: "25%" }}>
    <form>
        <h1 class="h3 mb-3 fw-normal">Create an Account</h1>

        <div class="form-floating">
        <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
        />
        <label for="floatingInput">Enter your university email</label>
        </div>
        <div class="form-floating">
        <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
        />
        <label for="floatingPassword">Create a password</label>
        </div>
        <div class="form-floating">
        <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
        />
        <label for="floatingPassword">Confirm your password</label>
        </div>
        <br/>
        <br/>
        <button class="btn btn-primary w-100 py-2" type="submit">
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