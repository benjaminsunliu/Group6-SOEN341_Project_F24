import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import mockAxios from 'jest-mock-axios';
import InstructorDashboard from '../src/pages/InstructorDashboard';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Named import
import '@testing-library/jest-dom';

// Mock the useNavigate function from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock Cookies and jwt-decode
jest.mock('js-cookie');
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(), // Mocking jwt-decode as a named export
}));

// Setup mocks before each test
beforeEach(() => {
  // Mock a valid JWT token in Cookies (simulate authenticated user)
  Cookies.get.mockReturnValue('valid-jwt-token');
  
  // Mock the jwtDecode to return a valid decoded token (instructor role)
  jwtDecode.mockReturnValue({ role: 'instructor' });
});

// Cleanup after each test
afterEach(() => {
  mockAxios.reset();
  jest.clearAllMocks();
});

// *********************************************************************************
// TEST 1: RENDERING THE INSTRUCTOR DASHBOARD
// *********************************************************************************
test('renders InstructorDashboard correctly', () => {
  render(
    <BrowserRouter>
      <InstructorDashboard />
    </BrowserRouter>
  );

  // Check if Course Name header exists
  expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
  // Check if upload input exists (file input)
  expect(screen.getByLabelText(/Upload Course Roster/i)).toBeInTheDocument();
  // Check if export button exists
  expect(screen.getByText(/Export Groups as CSV/i)).toBeInTheDocument();
});

// *********************************************************************************
// TEST 2: REDIRECTION IF NO TOKEN IS FOUND (Unauthorized Access)
// *********************************************************************************
test('redirects to login page if no token is found', () => {
  // Simulate no token being present in cookies
  Cookies.get.mockReturnValue(undefined);

  render(
    <BrowserRouter>
      <InstructorDashboard />
    </BrowserRouter>
  );

  // Expect to navigate to login page
  expect(mockNavigate).toHaveBeenCalledWith('/login');
});

// *********************************************************************************
// TEST 3: REDIRECTION IF USER IS NOT AN INSTRUCTOR (Role-based Access)
// *********************************************************************************
test('redirects to home page if user is not an instructor', () => {
  // Mock JWT to return a non-instructor role (e.g., student)
  jwtDecode.mockReturnValue({ role: 'student' });

  render(
    <BrowserRouter>
      <InstructorDashboard />
    </BrowserRouter>
  );

  // Expect to navigate to home page
  expect(mockNavigate).toHaveBeenCalledWith('/');
});

// *********************************************************************************
// TEST 4: FETCHING STUDENT DATA FROM API ON MOUNT (Success Case)
// *********************************************************************************
test('fetches and displays students from API on mount', async () => {
  // Mock API response
  const studentsData = [
    { fname: 'John', lname: 'Doe', email: 'john.doe@example.com', studentID: '123456', phone: '555-5555' },
  ];
  mockAxios.get.mockResolvedValue({ data: studentsData });

  render(
    <BrowserRouter>
      <InstructorDashboard />
    </BrowserRouter>
  );

  // Wait for the API response to be rendered
  await waitFor(() => {
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });
});

// *********************************************************************************
// TEST 5: ERROR HANDLING FOR STUDENT FETCHING (API Failure)
// *********************************************************************************
test('displays error message if student fetching fails', async () => {
  // Simulate API error response
  mockAxios.get.mockRejectedValue(new Error('Failed to fetch students'));

  render(
    <BrowserRouter>
      <InstructorDashboard />
    </BrowserRouter>
  );

  // Wait for error message to appear
  await waitFor(() => {
    expect(screen.getByText(/Failed to fetch students/i)).toBeInTheDocument();
  });
});

// *********************************************************************************
// TEST 6: FILE UPLOAD FUNCTIONALITY (Success Case)
// *********************************************************************************
test('uploads course roster file successfully', async () => {
  const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });

  // Mock successful file upload response
  mockAxios.post.mockResolvedValue({ data: 'File uploaded successfully' });

  render(
    <BrowserRouter>
      <InstructorDashboard />
    </BrowserRouter>
  );

  // Ensure you're targeting the correct label for the file input
  const fileInput = screen.getByLabelText(/Upload Course Roster/i);
  fireEvent.change(fileInput, {
    target: { files: [file] },
  });

  await waitFor(() => {
    expect(screen.getByText(/File uploaded successfully/i)).toBeInTheDocument();
  });
});

// *********************************************************************************
// TEST 7: ERROR HANDLING FOR FILE UPLOAD (Failure Case)
// *********************************************************************************
test('displays error message if file upload fails', async () => {
  const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });

  // Mock failed file upload response
  mockAxios.post.mockRejectedValue(new Error('File upload failed'));

  render(
    <BrowserRouter>
      <InstructorDashboard />
    </BrowserRouter>
  );

  // Simulate file upload event
  fireEvent.change(screen.getByLabelText(/Upload Course Roster/i), {
    target: { files: [file] },
  });

  // Wait for error message
  await waitFor(() => {
    expect(screen.getByText(/Error uploading file/i)).toBeInTheDocument();
  });
});

// *********************************************************************************
// TEST 8: CSV EXPORT FUNCTIONALITY (Success Case)
// *********************************************************************************
test('exports groups as CSV successfully', async () => {
  render(
    <BrowserRouter>
      <InstructorDashboard />
    </BrowserRouter>
  );

  // Mock window.location.href to avoid actual navigation
  delete window.location;
  window.location = { href: '' };

  // Simulate clicking on "Export Groups as CSV"
  fireEvent.click(screen.getByText(/Export Groups as CSV/i));

  // Check if the window.location.href is set to the correct export URL
  expect(window.location.href).toBe('http://localhost:5050/api/export-groups');
});

// *********************************************************************************
// TEST 9: CSV EXPORT FUNCTIONALITY (Edge Case - URL Format)
// *********************************************************************************
test('handles CSV export URL format properly', async () => {
  render(
    <BrowserRouter>
      <InstructorDashboard />
    </BrowserRouter>
  );

  // Mock window.location.href to avoid actual navigation
  delete window.location;
  window.location = { href: '' };

  // Trigger CSV export
  fireEvent.click(screen.getByText(/Export Groups as CSV/i));

  // Assert window.location.href
  expect(window.location.href).toBe('http://localhost:5050/api/export-groups');
});

// *********************************************************************************
// TEST 10: SWITCHING BETWEEN TABS
// *********************************************************************************
test('switches between tabs correctly', async () => {
  render(
    <BrowserRouter>
      <InstructorDashboard />
    </BrowserRouter>
  );

  // Simulate clicking on "Groups" tab
  fireEvent.click(screen.getByText(/Groups/i));

  // Expect Groups tab content to be rendered
  await waitFor(() => {
    expect(screen.getByText(/Groups/i)).toBeInTheDocument();
  });
});
