import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import mockAxios from 'jest-mock-axios';
import Login from '../src/pages/Login';
import '@testing-library/jest-dom';

// Mock the useNavigate function from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Cleanup. Resets mock axios after every test and clears previous mock function calls
afterEach(() => {
  mockAxios.reset();
  jest.clearAllMocks(); 
});

// **************************************************************************************************
// TEST LOGIN FORM RENDERING
// **************************************************************************************************
test('renders login form', () => {
  // Render Login page
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  
  // Check that email field renders
  expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
  // Check that password field renders
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
});

// **************************************************************************************************
// TEST EMPTY FORM SUBMISSION
// **************************************************************************************************
test('shows error when fields are empty', async() => {
  // Mock the alert function
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  // Render Login page
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // Click the login button
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // Check if alert was called with the correct message
  expect(alertMock).toHaveBeenCalledWith("Please fill out all fields.");

  // Cleanup
  alertMock.mockRestore();
});

// **************************************************************************************************
// TEST INVALID CREDENTIALS
// **************************************************************************************************
test('throws error when credentials are not valid', async () => {
  // Mock the alert function
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const invalidEmail = 'incorrectemail@concordia.ca';
  const invalidPassword = 'incorrectpassword';

  // Render login page
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
    target: { value: invalidEmail },
  });

  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: invalidPassword },
  });

  // Simulate clicking the login button
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // Simulate a failed login response
  mockAxios.mockError({ response: { data: { message: 'Login failed. Please try again.' } } });
});

// **************************************************************************************************
// TEST FOR Issue #10: "Instructors will be redirected to the instructor dashboard after logging in"
// **************************************************************************************************
test('redirects to the instructor dashboard on successful instructor login', async () => {
  // Mock the alert function
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const validEmail = 'instructor@concordia.ca';
  const validPassword = 'correctpassword';

  // Render page
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // Enter email
  fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
    target: { value: validEmail },
  });

  // Enter password
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: validPassword },
  });

  // Click the login button
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // Mock a successful login response with instructor role
  mockAxios.mockResponse({
    data: { role: 'instructor' },
  });

  // Expect mock navigation to the instructor dashboard
  await waitFor(() => {
    // Check if alert was called with the correct message
    expect(alertMock).toHaveBeenCalledWith("Successfully logged in as an instructor!");
    expect(mockNavigate).toHaveBeenCalledWith('/instructor-dashboard');
  });

  // Cleanup
  alertMock.mockRestore();
});

// **************************************************************************************************
// TEST FOR Issue #10: "Students will be redirected to the student dashboard after logging in"
// **************************************************************************************************
test('redirects to the student dashboard on successful student login', async () => {
  // Mock the alert function
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  const validEmail = 'student@mail.concordia.ca';
  const validPassword = 'correctpassword';

  // Render page
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // Enter email
  fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
    target: { value: validEmail },
  });

  // Enter password
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: validPassword },
  });

  // Click the login button
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // Mock a successful login response with student role
  mockAxios.mockResponse({
    data: { role: 'student' },
  });

  // Expect mock navigation to the student dashboard
  await waitFor(() => {
    // Check if alert was called with the correct message
    expect(alertMock).toHaveBeenCalledWith("Successfully logged in as a student!");
    expect(mockNavigate).toHaveBeenCalledWith('/student-dashboard');
  });

  // Cleanup
  alertMock.mockRestore();
});

// **************************************************************************************************
// TEST FOR ATTEMPTED LOGIN WHEN USER IS ALREADY LOGGED IN
// **************************************************************************************************
test('shows alert when user is already logged in', () => {
  // Mock the alert function
  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  // Set a mock token in the Cookies
  document.cookie = "token=mockToken";

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // Check if alert was called with the correct message
  expect(alertMock).toHaveBeenCalledWith("You are already logged in!");

  // Cleanup
  alertMock.mockRestore();
});


// **************************************************************************************************
// TEST FOR FORGOT PASSWORD BUTTON
// **************************************************************************************************
test('renders ForgotPassword component when "Forgot Password?" button is clicked', () => {
  // Render the Login page
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // Check that the "Forgot Password?" button is rendered
  const forgotPasswordButton = screen.getByRole('button', { name: /forgot password\?/i });
  expect(forgotPasswordButton).toBeInTheDocument();

  // Click the "Forgot Password?" button
  fireEvent.click(forgotPasswordButton);

  // Check that the "ForgotPassword" component is displayed
  expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();

  // Check the presence of the email input field and reset button
  expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /request password reset/i })).toBeInTheDocument();

  // Check the presence of the "Back to Login" button
  expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument();
});
