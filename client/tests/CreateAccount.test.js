import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import mockAxios from "jest-mock-axios";
import CreateAccount from "../src/pages/CreateAccount";
import "@testing-library/jest-dom";

// Mock the useNavigate function from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Cleanup. Resets mock axios after every test and clears previous mock function calls
afterEach(() => {
  mockAxios.reset();
  jest.clearAllMocks();
});

// **************************************************************************************************
// TEST CREATE ACCOUNT FORM RENDERING
// **************************************************************************************************
test("renders create account form", () => {
  // Render CreateAccount page
  render(
    <BrowserRouter>
      <CreateAccount />
    </BrowserRouter>
  );

  // Check that all fields render
  expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
});

// **************************************************************************************************
// TEST SUCCESSFUL ACCOUNT CREATION
// **************************************************************************************************
test("redirects user to login page on successful account creation", async () => {
  // Mock axios post to resolve with a 201 status
  mockAxios.post.mockResolvedValue({ status: 201 });

  // Render CreateAccount page
  render(
    <BrowserRouter>
      <CreateAccount />
    </BrowserRouter>
  );

  // Enter first name
  fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
    target: { value: "FirstName" },
  });

  // Enter last name
  fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
    target: { value: "LastName" },
  });

  // Enter email
  fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
    target: { value: "student@mail.concordia.ca" },
  });

  // Create password
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: "Str0ngpassw0rd!" },
  });

  // Create a student account
  fireEvent.click(screen.getByLabelText("Student"));

  // Click the "Create Account" button
  fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

  // Wait for axios post request to resolve
  await waitFor(() => {
    // Verify that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});

// **************************************************************************************************
// TEST BASIC FORM VALIDATION
// **************************************************************************************************
test("shows error when fields are empty", async () => {
  // Mock the alert function
  const alertMock = jest.spyOn(window, "alert").mockImplementation();

  // Render CreateAccount page
  render(
    <BrowserRouter>
      <CreateAccount />
    </BrowserRouter>
  );

  // Click the login button
  fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

  // Check if alert was called with the correct message
  expect(alertMock).toHaveBeenCalledWith("Please fill out all fields.");

  // Cleanup
  alertMock.mockRestore();
});

// **************************************************************************************************
// TEST PASSWORD FORMAT VALIDATION
// **************************************************************************************************
test("shows error when password is weak", () => {
  // Mock the alert function
  const alertMock = jest.spyOn(window, "alert").mockImplementation();

  // Render CreateAccount page
  render(
    <BrowserRouter>
      <CreateAccount />
    </BrowserRouter>
  );

  // Enter first name
  fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
    target: { value: "FirstName" },
  });

  // Enter last name
  fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
    target: { value: "LastName" },
  });

  // Enter email
  fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
    target: { value: "student@mail.concordia.ca" },
  });

  // Create password
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: "weakpassword" },
  });

  // Create a student account
  fireEvent.click(screen.getByLabelText("Student"));

  // Click the "Create Account" button
  fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

  expect(alertMock).toHaveBeenCalledWith(
    "Password must be at least 8 characters long, contain at least one number, one lowercase and one uppercase letter."
  );

  // Cleanup
  alertMock.mockRestore();
});

// **************************************************************************************************
// TEST EMAIL FORMAT VALIDATION
// **************************************************************************************************
test("shows error when email format is not valid", () => {
  // Mock the alert function
  const alertMock = jest.spyOn(window, "alert").mockImplementation();

  // Render CreateAccount page
  render(
    <BrowserRouter>
      <CreateAccount />
    </BrowserRouter>
  );

  // Enter first name
  fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
    target: { value: "FirstName" },
  });

  // Enter last name
  fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
    target: { value: "LastName" },
  });

  // Enter email
  fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
    target: { value: "invalidemail.com" },
  });

  // Create password
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: "Str0ngpassw0rd!" },
  });

  // Create a student account
  fireEvent.click(screen.getByLabelText("Student"));

  // Click the "Create Account" button
  fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

  expect(alertMock).toHaveBeenCalledWith("Please enter a valid email address.");

  // Cleanup
  alertMock.mockRestore();
});

// **************************************************************************************************
// TEST FOR EXISTING ACCOUNT
// **************************************************************************************************

test("shows error when account already exists", async () => {
  mockAxios.post.mockRejectedValue({ response: { status: 409 } });

  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

  render(
    <BrowserRouter>
      <CreateAccount />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
    target: { value: "FirstName" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
    target: { value: "LastName" },
  });
  fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
    target: { value: "student@mail.concordia.ca" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: "Str0ngpassw0rd!" },
  });
  fireEvent.click(screen.getByLabelText("Student"));
  fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

  await waitFor(() =>
    expect(alertMock).toHaveBeenCalledWith("Email already in use.")
  );

  alert.mockRestore();
});
