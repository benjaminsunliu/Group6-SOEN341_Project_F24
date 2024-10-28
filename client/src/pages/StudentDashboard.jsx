import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import "./Dashboard.css";
import TabContainer from "../components/TabContainer";
import StudentTable from "../components/StudentTable"; // Import the StudentTable component

const StudentDashboard = (props) => {
  const navigate = useNavigate();
  const [studentTeams, setStudentTeams] = useState([]); // State for teams the student is in
  const [otherTeams, setOtherTeams] = useState([]); // State for other teams
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const { role } = decodedToken;

      if (role !== 'student') {
        navigate('/');
      } else {
        fetchTeams(token);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchTeams = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5050/api/get-teams", {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });
      setStudentTeams(response.data.studentTeams); // Set student teams
      setOtherTeams(response.data.otherTeams); // Set other teams
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabsData = [
    {
      id: "assessments",
      label: "Assessments",
      content: (
        <div className="Dashboard-contents">
          <h3>Your Teams</h3>
          {loading ? (
            <p>Loading teams...</p>
          ) : (
            <StudentTable tableContents={{ headers: [{ id: 'name', title: 'Team Name' }, { id: 'members', title: 'Members' }], contents: studentTeams }} />
          )}
          <h3>Other Teams</h3>
          {loading ? (
            <p>Loading other teams...</p>
          ) : (
            <StudentTable tableContents={{ headers: [{ id: 'name', title: 'Team Name' }, { id: 'members', title: 'Members' }], contents: otherTeams }} />
          )}
        </div>
      ),
    },
    {
      id: "personal-report",
      label: "My Personal Report",
      content: (
        <div className="Dashboard-contents">
          <p>Your profile is missing reviews from one or more of your peers. You may not yet access your personal report.</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1 className="Dashboard-header">Course Name</h1>
      <div>
        <TabContainer tabs={tabsData} />
      </div>
    </>
  );
};

export default StudentDashboard;
