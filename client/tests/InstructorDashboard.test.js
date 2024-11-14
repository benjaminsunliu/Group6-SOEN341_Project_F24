import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import InstructorDashboard from '../src/pages/InstructorDashboard.jsx'; // Adjusted path
import { BrowserRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Mock axios
const mock = new MockAdapter(axios);

// Mock Cookies and jwtDecode
jest.mock('js-cookie');
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(), // Ensure jwtDecode is mocked correctly as a named import
}));

describe('InstructorDashboard', () => {
  beforeEach(() => {
    // Mock token and role
    Cookies.get.mockReturnValue('mockToken');
    jwtDecode.mockReturnValue({ role: 'instructor' }); // Mock implementation returning an object
  });

  afterEach(() => {
    mock.reset();
  });

  test('renders InstructorDashboard and fetches students', async () => {
    render(
      <Router>
        <InstructorDashboard />
      </Router>
    );

    // Check if the students table is rendered
    await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());
  });

  test('imports course roster', async () => {
    render(
      <Router>
        <InstructorDashboard />
      </Router>
    );

    // Use a more specific approach to find the input element
    const input = screen.getByLabelText(/Upload course roster/i);
    const file = new File(['dummy content'], 'example.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });

    // Check if the file upload was successful
    await waitFor(() => expect(screen.getByText(/File uploaded successfully/i)).toBeInTheDocument());
  });

  test('exports groups as CSV', async () => {
    render(
      <Router>
        <InstructorDashboard />
      </Router>
    );

    // Mock window.location.href
    delete window.location;
    window.location = { href: jest.fn() };

    // Click the export button
    fireEvent.click(screen.getByText(/Export Groups as CSV/i));

    // Check if the export URL was called
    await waitFor(() => expect(window.location.href).toBe('http://localhost:5050/api/export-groups'));
  });
});

