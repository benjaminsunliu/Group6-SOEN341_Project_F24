import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../src/layout/Navbar";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

test("Navbar links redirect to correct pages", () => {
  render(
    <Router>
      <Navbar />
    </Router>
  );

  // Check "Home" link
  const homeLink = screen.getByRole("link", { name: /home/i });
  expect(homeLink.getAttribute("href")).toBe("/");

  // Check "Login" link
  const loginLink = screen.getByRole("link", { name: /login/i });
  expect(loginLink.getAttribute("href")).toBe("/login");

  // Check "Create Account" link
  const createAccountLink = screen.getByRole("link", { name: /create account/i });
  expect(createAccountLink.getAttribute("href")).toBe("/create-account");
});
