import { Link } from "react-router-dom";
import { useState } from "react";

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = () => {
    alert(`Logged into an account with ${email} ${password}`);
}

  return (
    <div class="container" style={{ padding: "13% 0%" }}>
      <main class="form-signin m-auto" style={{ width: "25%" }}>
        <form onSubmit={loginHandler}>
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
          <button class="btn btn-primary w-100 py-2" type="submit">
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
