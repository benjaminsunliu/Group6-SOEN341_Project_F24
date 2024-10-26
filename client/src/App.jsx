import "./App.css";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Button from "./components/Button";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <body>
          {" "}
          {/* can change text-bg-dark to text-bg-light */}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/create-account" element={<CreateAccount />}></Route>
            <Route
              path="/instructor-dashboard"
              element={<InstructorDashboard />}
            ></Route>
            <Route
              path="/student-dashboard"
              element={<StudentDashboard />}
            ></Route>
          </Routes>
        </body>
        <Footer />
      </div>
    </Router>
  );
}

export default App;