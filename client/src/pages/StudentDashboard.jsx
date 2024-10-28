import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import "./Dashboard.css";
import TabContainer from "../components/TabContainer";
import Button from "../components/Button";
import GroupList from "../components/GroupList";


const StudentDashboard = (props) => {

  const navigate = useNavigate();
  
  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from cookies
    if (token) {
      const decodedToken = jwtDecode(token);
      const { role } = decodedToken; // Get the role from the decoded token

      // Check if the role is not 'student'
      if (role !== 'student') {
        navigate('/'); // Redirect to login if not a student
      }
    } else {
      navigate('/login'); // Redirect to login if no token is found
    }
  }, [navigate]);


  const tabsData = [
    {
      id: "assessments",
      label: "Assessments",
      content: (
        <div class="Dashboard-contents">
            <p>Group list and "assess" buttons will be here</p>
            <GroupList/>

        </div>
        ),
    },
    {
      id: "personal-report",
      label: "My Personal Report",
      content: (
        <div class="Dashboard-contents">
            <p>Your profile is missing reviews from one or more of your peers. You may not yet access your personal report.</p>
        </div>
      ),    
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

export default StudentDashboard;
