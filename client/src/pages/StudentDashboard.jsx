import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import "./Dashboard.css";
import TabContainer from "../components/TabContainer";
import Button from "../components/Button";
import GroupList from "../components/GroupList";
import RatingForm from "../components/RatingForm";
import RatingList from "../components/RatingList";
import CalendarComponent from '../components/CalendarComponent';
import ChillGuyJokes from '../components/chill';
import EmojiMatch from '../components/emojimatch';
import BubblePop from '../components/bubblepop';
import MusicPlayer from '../components/musicPlayer';

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
            <p>Your Groups</p>
            <GroupList/>
            <RatingForm/>

        </div>
        ),
    },
    {
      id: "personal-report",
      label: "My Personal Report",
      content: (
        <div class="Dashboard-contents">
            <RatingList/>
        </div>
      ),    
    },
    {
      id: "calendar",
      label: "Calendar",
      content: <div class="Dashboard-contents">
        <CalendarComponent/>
      </div>,
    },
    {
      id: "chill",
      label: "Chill",
      content: (activeTab) => (
      <div class="Dashboard-contents">
        {activeTab === "chill" && <MusicPlayer shouldPlay={activeTab === "chill"} />}
        <h1>Get some chill jokes:</h1>
        <ChillGuyJokes/>  
        <br/>
        <h1>Play some chill games:</h1>
        <EmojiMatch/>
        <br/>
        <BubblePop/>
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
