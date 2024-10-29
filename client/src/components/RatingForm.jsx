import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"; // Change this line
import "./RatingForm.css";

const RatingForm = () => {
  const [members, setMembers] = useState([]);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [cooperationRating, setCooperationRating] = useState(1);
  const [conceptualRating, setConceptualRating] = useState(1);
  const [practicalRating, setPracticalRating] = useState(1);
  const [workEthicRating, setWorkEthicRating] = useState(1);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const token = Cookies.get("token");
      const decodedToken = jwtDecode(token);
      const loggedInEmail = decodedToken.email;
  
      try {
        const membersResponse = await axios.get("http://localhost:5050/api/team-members", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
  
        const ratedResponse = await axios.get(`http://localhost:5050/api/rated-members/${loggedInEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
  
        const ratedMembers = ratedResponse.data.ratedEmails.map(email => email.toLowerCase());
        const filteredMembers = membersResponse.data.members.filter(
          member => !ratedMembers.includes(member.toLowerCase()) && member.toLowerCase() !== loggedInEmail.toLowerCase()
        );
        
        setMembers(filteredMembers);
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (showForm) {
      fetchMembers();
    }
  }, [showForm]);

  const submitRating = async () => {
    const token = Cookies.get("token");
    const decodedToken = jwtDecode(token);
    
    try {
      const ratingData = {
        raterEmail: decodedToken.email,
        ratedEmail: selectedEmail,
        cooperation: cooperationRating,
        conceptualContribution: conceptualRating,
        practicalContribution: practicalRating,
        workEthic: workEthicRating,
        comments,
      };
  
      const response = await axios.post("http://localhost:5050/api/rate", ratingData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      alert(response.data.message);
      setShowForm(false); // Close the form after successful submission
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("You have already rated this teammate.");
      } else {
        console.error("Error submitting rating:", error);
      }
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Rate Your Peers</button>

      {showForm && (
        <div className="overlay">
          <div className="slide-in-form">
            <button className="close-btn" onClick={() => setShowForm(false)}>X</button>
            <h2>Rate Your Teammates</h2>
            {loading ? (
              <p>Loading team members...</p>
            ) : (
              <>
                <label htmlFor="member-select">Select a teammate:</label>
                <select
                  id="member-select"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                >
                  <option value="">--Select a teammate--</option>
                  {members.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>

                <div>
                  <label>(1-5) Cooperation:</label>
                  <input
                    type="number"
                    value={cooperationRating}
                    min="1"
                    max="5"
                    onChange={(e) => setCooperationRating(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label>(1-5) Conceptual Contribution:</label>
                  <input
                    type="number"
                    value={conceptualRating}
                    min="1"
                    max="5"
                    onChange={(e) => setConceptualRating(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label>(1-5) Practical Contribution:</label>
                  <input
                    type="number"
                    value={practicalRating}
                    min="1"
                    max="5"
                    onChange={(e) => setPracticalRating(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label>(1-5) Work Ethic:</label>
                  <input
                    type="number"
                    value={workEthicRating}
                    min="1"
                    max="5"
                    onChange={(e) => setWorkEthicRating(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label>Comments:</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    maxLength={500}
                  />
                </div>

                <button onClick={submitRating}>Submit Rating</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingForm;
