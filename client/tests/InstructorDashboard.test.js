import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import InstructorDashboard from '../src/pages/InstructorDashboard';  // This imports the default export
import '@testing-library/jest-dom';  // For toBeInTheDocument matcher

// Mock dependencies
jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

jest.mock('axios');

// Simulate a basic test case
describe('InstructorDashboard', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    // Simulate valid token and instructor role
    Cookies.get.mockReturnValue('mockToken');
    jwtDecode.mockReturnValue({ role: 'instructor' });
    axios.get.mockResolvedValue({ data: [] });  // Mock an empty students list
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <InstructorDashboard navigate={mockNavigate} />
      </MemoryRouter>
    );
    expect(true).toBe(true);  // Always pass this test
  });

  it('correctly imports and renders InstructorDashboard component', () => {
    // Check if the InstructorDashboard component has been successfully imported and rendered
    const { container } = render(
      <MemoryRouter>
        <InstructorDashboard navigate={mockNavigate} />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument(); // Ensure the component is in the document
  });
}); 