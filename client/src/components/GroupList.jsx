import InstructorDashboard from "../pages/InstructorDashboard";
import Button from "./Button";
import CollapsableButton from "./CollapsableButton";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const GroupList = (props) => {
  // UseEffect to get the logged-in instructor's userId from the cookie and fetch teams
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token"); // Get the token from cookies
    if (!token) {
      console.error("No token found");
      return;
    }

    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5050/api/get-teams",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set the Authorization header with the token
            },
            withCredentials: true, // Send cookies with the request
          }
        );
        // Set the state with the filtered teams
        setTeams(response.data.teams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }); // Runs when at all times

  return (
    <>
      <table
        className="table table-default table-hover"
        style={{ textAlign: "center" }}
      >
        <tbody>
          <tr></tr>
          {teams.map((team, index) => (
            // would use group name or something else as the key w=once we can access the database
            <tr key={teams.id}>
              <div style={{ margin: "1px" }}>
                <CollapsableButton
                  // once we can fetch group names from database change the buttonText to the actual group name
                  buttonText={team.name}
                  buttonColor="btn btn-primary"
                />
              </div>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GroupList;
