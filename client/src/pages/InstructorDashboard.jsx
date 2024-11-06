import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import TabContainer from "../components/TabContainer";
import Button from "../components/Button";
import SingleFileUploader from "../components/SingleFileUploader";
import GroupForm from "../components/GroupForm";
import StudentTable from "../components/StudentTable";
import GroupList from "../components/GroupList";
import InstructorRatings from "../components/InstructorRatings";
import axios from "axios";

const InstructorDashboard = (props) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);


  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/students', {
        withCredentials: true,
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error.response ? error.response.data : error.message);
    }
  };



  useEffect(() => {
    const token = Cookies.get("token"); // Get the token from cookies
    if (token) {
      const decodedToken = jwtDecode(token);
      const { role } = decodedToken; // Get the role from the decoded token

      // Check if the role is not 'instructor'
      if (role !== "instructor") {
        navigate("/"); // Redirect to login if not an instructor
      } else {
        fetchStudents(); // Fetch students from the database
      }
    } else {
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);


  const importCourseRoster = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:5050/api/import-roster', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('Response from server:', response.data);
      fetchStudents(); // Fetch updated students after import
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
    }
  };


  const exportcsv = async (e) => {
    e.preventDefault();
    try {
      window.location.href = "http://localhost:5050/api/export-groups";
    } catch (error) {
      console.error(error);
    }
  };

  // Placeholders: replace with headers from database
  const tableHeaders = [
    { id: "fname", title: "First Name" },
    { id: "lname", title: "Last Name" },
    { id: "email", title: "Email" },
    { id: "studentID", title: "Student ID" },
    { id: "phone", title: "Phone Number" },
  ];



  const tabsData = [
    {
      id: "students",
      label: "Students",
      content: (
        <div className="Dashboard-contents">
          <StudentTable
            tableContents={{ headers: tableHeaders, contents: students }}
          />
          <SingleFileUploader
            fileExtension="csv"
            fileDescription="course roster"
            fileSubmitHandler={importCourseRoster}
          />
        </div>
      ),
    },
    {
      id: "groups",
      label: "Groups",
      content: (
        <div class="Dashboard-contents">
          {/* If I want to access students array from inside GroupList I need to pass it to that component */}
          <GroupList />
          <GroupForm students={students} />
          <Button
            buttonText="Export Groups as CSV"
            buttonColor="btn btn-secondary"
            onClick={exportcsv}
          />
        </div>
      ),
    },
    {
      id: "assessments",
      label: "Assessments",
      content: <div class="Dashboard-contents"><InstructorRatings /></div>,
    },
  ];

  return (
    <>
      <h1 class="Dashboard-header">Course Name</h1>
      <div class="">
        <TabContainer tabs={tabsData} />
      </div>
    </>
  );
};

export default InstructorDashboard;
