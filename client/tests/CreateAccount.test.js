import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import CreateAccount from '../src/pages/CreateAccount';
import '@testing-library/jest-dom';

test('renders create account form', () => {
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

test('alerts for invalid email address', async() => {
    const firstName = "Sheela";
    const lastName = "Na'Gig";
    const email = "dodgyemail.com";
    const password = "str0ngPassw0rd!";

    render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );
  
    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
        target: { value: firstName },
    });

    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
        target: { value: lastName },
    });

    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
        target: { value: email },
    });

    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
        target: { value: password },
    });

    fireEvent.click(screen.getByLabelText(/student/i));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await screen.findByRole('alert');
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid email address.');
});

test('alerts for weak password', async() => {
    const firstName = "Sheela";
    const lastName = "Na'Gig";
    const email = "queen_sheela@concordia.ca";
    const password = "weakpassword";

    render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );
  
    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
        target: { value: firstName },
    });

    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
        target: { value: lastName },
    });

    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
        target: { value: email },
    });

    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
        target: { value: password },
    });

    fireEvent.click(screen.getByLabelText(/student/i));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await screen.findByRole('alert');
    expect(screen.getByRole('alert')).toHaveTextContent('Password must be at least 8 characters long, contain at least one number, one lowercase and one uppercase letter.');
});