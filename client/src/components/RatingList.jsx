import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import ".//css/RatingList.css"; 

const UserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      const token = Cookies.get("token");
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken.email;

      try {
        const response = await axios.get(`http://localhost:5050/api/user-ratings/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setRatings(response.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  return (
    <div>
      <h2>Your Ratings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : ratings.length > 0 ? (
        <ul className="rating-list">
          {ratings.map((rating, index) => (
            <li key={index} className="rating-item">
              <p><strong>{rating.raterNumber}</strong></p>
              <p><strong>Cooperation:</strong> {rating.cooperation}</p>
              <p><strong>Conceptual Contribution:</strong> {rating.conceptualContribution}</p>
              <p><strong>Practical Contribution:</strong> {rating.practicalContribution}</p>
              <p><strong>Work Ethic:</strong> {rating.workEthic}</p>
              <p><strong>Anonymous feedback:</strong> <br></br> {rating.comments || "No comments"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ratings found.</p>
      )}
    </div>
  );
};

export default UserRatings;
