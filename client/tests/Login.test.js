import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import Login from '../src/pages/Login';
import '@testing-library/jest-dom';

test('renders login form', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  
  // Check that email and password field elements render
  expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
});

test('shows error when fields are empty', async() => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // Simulate clicking the login button
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await screen.findByRole('alert')
  expect(screen.getByRole('alert')).toHaveTextContent('Please fill out all fields')
});

test('shows error when credentials are not valid', async() => {
  const invalidEmail = 'incorrectemail@concordia.ca';
  const invalidPassword = 'incorrectpassword';

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

  await screen.findByRole('alert');
  expect(screen.getByRole('alert')).toHaveTextContent('Login failed. Please try again.');
});