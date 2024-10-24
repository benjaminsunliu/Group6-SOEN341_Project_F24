import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CollapsableButton = (props) => {
  const [clicked, setClicked] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  // UseEffect to get the logged-in instructor's userId from the cookie and fetch teams
  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from cookies
    if (!token) {
      console.error("No token found");
      return;
    }

    const fetchTeams = async () => {
      if (clicked) {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:5050/api/get-teams", {
            headers: {
              'Authorization': `Bearer ${token}` // Set the Authorization header with the token
            },
            withCredentials: true, // Send cookies with the request
          });
          // Set the state with the filtered teams
          setTeams(response.data.teams);
        } catch (error) {
          console.error("Error fetching teams:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchTeams();
  }, [clicked]); // Runs when 'clicked' changes

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <>
      <button onClick={handleClick} className={props.buttonColor}>
        {props.buttonText}
      </button>
      {clicked && (
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table
              className="table table-default table-hover"
              style={{ textAlign: "center", marginTop: "1rem" }}
            >
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team._id}>
                    <td>{team.name}</td>
                    <td>{team.members.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
};

export default CollapsableButton;
