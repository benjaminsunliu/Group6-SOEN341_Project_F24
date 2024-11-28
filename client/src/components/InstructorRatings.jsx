import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import "./css/InstructorRatings.css";

const InstructorRatings = () => {
  const [teams, setTeams] = useState([]);
  const [ratingsByStudent, setRatingsByStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDetailedView, setIsDetailedView] = useState(false);

  useEffect(() => {
    const fetchInstructorRatings = async () => {
      setLoading(true);
      const token = Cookies.get("token");
      const decodedToken = jwtDecode(token);
      const instructorId = decodedToken.userId;

      try {
        const response = await axios.get(`http://localhost:5050/api/instructor/${instructorId}/ratings`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setTeams(response.data.teams);
        setRatingsByStudent(response.data.ratingsByStudent);
      } catch (error) {
        console.error("Error fetching instructor ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorRatings();
  }, []);

  const toggleView = () => {
    setIsDetailedView(!isDetailedView);
  };

  const calculateSummary = (ratings) => {
    const totalRatings = ratings.length;
    const summary = {
      cooperation: 0,
      conceptualContribution: 0,
      practicalContribution: 0,
      workEthic: 0,
    };

    ratings.forEach(rating => {
      summary.cooperation += rating.cooperation;
      summary.conceptualContribution += rating.conceptualContribution;
      summary.practicalContribution += rating.practicalContribution;
      summary.workEthic += rating.workEthic;
    });

    return {
      cooperation: (summary.cooperation / totalRatings).toFixed(2),
      conceptualContribution: (summary.conceptualContribution / totalRatings).toFixed(2),
      practicalContribution: (summary.practicalContribution / totalRatings).toFixed(2),
      workEthic: (summary.workEthic / totalRatings).toFixed(2),
      count: totalRatings,
    };
  };

  return (
    <div className="container">
      <h2>Student Assessments</h2>
      <button onClick={toggleView}>
        {isDetailedView ? 'Show Summary View' : 'Show Detailed View'}
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : teams.length > 0 ? (
        <>
          <div>
            <h3>Your Teams</h3>
            {teams.map((team, index) => (
              <div key={index} className="team-section">
                <h4>Team: {team.name}</h4>
                <p>Members: {team.members.join(', ')}</p>
              </div>
            ))}
          </div>

          <div>
  <h3>{isDetailedView ? 'Detailed Ratings by Student' : 'Summary Ratings by Student'}</h3>
  {Object.entries(ratingsByStudent).map(([email, ratings], index) => (
    <div key={index} className="student-section">
      <h4>{email}</h4>
      {isDetailedView ? (
        // Detailed View: List each individual rating
        <ul className="rating-records">
          {ratings.map((rating, idx) => (
            <li key={idx} className="rating-object rating-box">
              <p><strong>Rater:</strong> {rating.raterEmail}</p>
              <p><strong>Cooperation:</strong> {rating.cooperation}</p>
              <p><strong>Conceptual Contribution:</strong> {rating.conceptualContribution}</p>
              <p><strong>Practical Contribution:</strong> {rating.practicalContribution}</p>
              <p><strong>Work Ethic:</strong> {rating.workEthic}</p>
              <p><strong>Comments:</strong> {rating.comments || "No comments"}</p>
            </li>
          ))}
        </ul>
      ) : (
        // Summary View: Display average scores and rating count
        <div className="rating-summary rating-box">
          {ratings.length > 0 ? (
            <>
              <p><strong>Average Cooperation:</strong> {calculateSummary(ratings).cooperation}</p>
              <p><strong>Average Conceptual Contribution:</strong> {calculateSummary(ratings).conceptualContribution}</p>
              <p><strong>Average Practical Contribution:</strong> {calculateSummary(ratings).practicalContribution}</p>
              <p><strong>Average Work Ethic:</strong> {calculateSummary(ratings).workEthic}</p>
              <p><strong>Total Ratings:</strong> {calculateSummary(ratings).count}</p>
            </>
          ) : (
            <p>No ratings available for this student.</p>
          )}
        </div>
      )}
    </div>
  ))}
</div>

        </>
      ) : (
        <p>No teams or ratings found.</p>
      )}
    </div>
  );
};

export default InstructorRatings;
