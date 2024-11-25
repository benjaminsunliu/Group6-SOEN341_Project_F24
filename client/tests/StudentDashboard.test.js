import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import StudentDashboard from "../src/pages/StudentDashboard";
import "@testing-library/jest-dom";

// **************************************************************************************************
// MOCKS AND CLEANUP SECTION
// **************************************************************************************************

// Mock the useNavigate function
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock jwtDecode
jest.mock("jwt-decode", () => jest.fn());

// Mock alert to prevent it from failing tests
global.alert = jest.fn();

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  Cookies.remove("token");
});

// **************************************************************************************************
// TEST RENDERING FOR STUDENTS
// **************************************************************************************************
test("renders StudentDashboard for a student", () => {
  // Mock a valid student token
  const mockToken = "mockToken";
  Cookies.set("token", mockToken);
  jwtDecode.mockReturnValue({ role: "student" });

  // Render StudentDashboard page
  render(
    <BrowserRouter>
      <StudentDashboard />
    </BrowserRouter>
  );

  // Check that the dashboard header and tabs are rendered
  expect(screen.getByText(/course name/i)).toBeInTheDocument();
  expect(screen.getByText(/assessments/i)).toBeInTheDocument();
  expect(screen.getByText(/my personal report/i)).toBeInTheDocument();
  expect(screen.getByText(/calendar/i)).toBeInTheDocument();
});

// **************************************************************************************************
// TEST REDIRECTION FOR NON-STUDENTS
// **************************************************************************************************
test("redirects non-students to home page", () => {
  // Mock a token with a non-student role
  const mockToken = "mockToken";
  Cookies.set("token", mockToken);
  jwtDecode.mockReturnValue({ role: "instructor" });

  // Render StudentDashboard
  render(
    <BrowserRouter>
      <StudentDashboard />
    </BrowserRouter>
  );

  // Check redirection to home page
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

// **************************************************************************************************
// TEST REDIRECTION FOR UNAUTHENTICATED USERS
// **************************************************************************************************
test("redirects unauthenticated users to login page", () => {
  // Render StudentDashboard without a token
  render(
    <BrowserRouter>
      <StudentDashboard />
    </BrowserRouter>
  );

  // Check redirection to login page
  expect(mockNavigate).toHaveBeenCalledWith("/login");
});

// **************************************************************************************************
// TEST REDIRECTION ON INVALID TOKEN
// **************************************************************************************************
test("redirects to login on invalid token", () => {
  // Mock an invalid token
  const mockToken = "invalidToken";
  Cookies.set("token", mockToken);
  jwtDecode.mockImplementation(() => {
    throw new Error("Invalid token");
  });

  // Render StudentDashboard
  render(
    <BrowserRouter>
      <StudentDashboard />
    </BrowserRouter>
  );

  // Check redirection to login page
  expect(mockNavigate).toHaveBeenCalledWith("/login");
});

// **************************************************************************************************
// TEST TABS RENDERING
// **************************************************************************************************
test("renders tabs content correctly", () => {
  // Mock a valid student token
  const mockToken = "mockToken";
  Cookies.set("token", mockToken);
  jwtDecode.mockReturnValue({ role: "student" });

  // Render StudentDashboard
  render(
    <BrowserRouter>
      <StudentDashboard />
    </BrowserRouter>
  );

  // Check "Assessments" tab is rendered
  expect(screen.getByText(/assessments/i)).toBeInTheDocument();

  // Check "My Personal Report" tab is rendered
  expect(screen.getByText(/my personal report/i)).toBeInTheDocument();

  // Check "Calendar" tab is rendered
  expect(screen.getByText(/calendar/i)).toBeInTheDocument();
});
