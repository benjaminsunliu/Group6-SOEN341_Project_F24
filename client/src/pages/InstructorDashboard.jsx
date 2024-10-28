import { useEffect } from "react";
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


const InstructorDashboard = (props) => {
  const navigate = useNavigate();

  // TODO: Implement backend roster import functionality
  const importCourseRoster = (file) => {
    alert(`File to upload: ${file.name}`);
  };

  useEffect(() => {
    const token = Cookies.get("token"); // Get the token from cookies
    if (token) {
      const decodedToken = jwtDecode(token);
      const { role } = decodedToken; // Get the role from the decoded token

      // Check if the role is not 'instructor'
      if (role !== "instructor") {
        navigate("/"); // Redirect to login if not an instructor
      }
    } else {
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

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

  // Placeholders: Load this info on the server side
  const students = [
    {
      fname: "Liam",
      lname: "Nguyen",
      email: "liam.nguyen@live.concordia.ca",
      studentID: "12345678",
      phone: "438 1112345",
    },
    {
      fname: "Ava",
      lname: "Martinez",
      email: "ava.martinez@live.concordia.ca",
      studentID: "23456789",
      phone: "438 2223456",
    },
    {
      fname: "Omar",
      lname: "Khan",
      email: "omar.khan@live.concordia.ca",
      studentID: "34567890",
      phone: "438 3334567",
    },
    {
      fname: "Zara",
      lname: "Patel",
      email: "zara.patel@live.concordia.ca",
      studentID: "45678901",
      phone: "438 4445678",
    },
    {
      fname: "Noah",
      lname: "Garcia",
      email: "noah.garcia@live.concordia.ca",
      studentID: "56789012",
      phone: "438 5556789",
    },
    {
      fname: "Maya",
      lname: "Singh",
      email: "maya.singh@live.concordia.ca",
      studentID: "67890123",
      phone: "438 6667890",
    },
    {
      fname: "Ethan",
      lname: "Chen",
      email: "ethan.chen@live.concordia.ca",
      studentID: "78901234",
      phone: "438 7778901",
    },
    {
      fname: "Sophia",
      lname: "Lee",
      email: "sophia.lee@live.concordia.ca",
      studentID: "89012345",
      phone: "438 8889012",
    },
    {
      fname: "Isaac",
      lname: "Hernandez",
      email: "isaac.hernandez@live.concordia.ca",
      studentID: "90123456",
      phone: "438 9990123",
    },
    {
      fname: "Aria",
      lname: "Wang",
      email: "aria.wang@live.concordia.ca",
      studentID: "01234567",
      phone: "438 0001234",
    },
    {
      fname: "Mateo",
      lname: "Lopez",
      email: "mateo.lopez@live.concordia.ca",
      studentID: "13579246",
      phone: "438 1112346",
    },
    {
      fname: "Layla",
      lname: "Rodriguez",
      email: "layla.rodriguez@live.concordia.ca",
      studentID: "24681357",
      phone: "438 2223457",
    },
    {
      fname: "Jackson",
      lname: "Gonzalez",
      email: "jackson.gonzalez@live.concordia.ca",
      studentID: "35792468",
      phone: "438 3334568",
    },
    {
      fname: "Emily",
      lname: "Martinez",
      email: "emily.martinez@live.concordia.ca",
      studentID: "46813579",
      phone: "438 4445679",
    },
    {
      fname: "Lucas",
      lname: "Thomas",
      email: "lucas.thomas@live.concordia.ca",
      studentID: "57924680",
      phone: "438 5556780",
    },
    {
      fname: "Sofia",
      lname: "Anderson",
      email: "sofia.anderson@live.concordia.ca",
      studentID: "68035791",
      phone: "438 6667891",
    },
    {
      fname: "Benjamin",
      lname: "Taylor",
      email: "benjamin.taylor@live.concordia.ca",
      studentID: "79146802",
      phone: "438 7778902",
    },
    {
      fname: "Chloe",
      lname: "Wilson",
      email: "chloe.wilson@live.concordia.ca",
      studentID: "80257913",
      phone: "438 8889013",
    },
    {
      fname: "Daniel",
      lname: "Davis",
      email: "daniel.davis@live.concordia.ca",
      studentID: "91368024",
      phone: "438 9990124",
    },
    {
      fname: "Mia",
      lname: "Garcia",
      email: "mia.garcia@live.concordia.ca",
      studentID: "02479135",
      phone: "438 0001235",
    },
  ];
  const assessments = [
    {
      fname: "Liam",
      lname: "Nguyen",
      assessment: "Assignment 1",
    },
    {
      fname: "Ava",
      lname: "Martinez",
      assessment: "Assignment 1",
    },
    {
      fname: "Omar",
      lname: "Khan",
      assessment: "Assignment 1",
    },
  ];

  const tabsData = [
    {
      id: "students",
      label: "Students",
      content: (
        <div class="Dashboard-contents">
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
      content: <div class="Dashboard-contents">Peer assessments go here</div>,
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
