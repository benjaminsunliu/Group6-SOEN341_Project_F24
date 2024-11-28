import StudentChecklist from "./StudentChecklist";
import Button from "./Button";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import "./css/GroupForm.css"
import { useState } from "react";
import axios from "axios";

const GroupForm = ({ students }) => {

    const [groupMembers, setGroupMembers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [,setGroups] = useState([]);
    const [groupedStudents, setStudentsAsGrouped] = useState([]);

    const selectionHandler = (e) => { 

        const studentEmail = e.target.value;
        setGroupMembers((currentGroup) => {
            // If student is already in that group, then remove them
            if(currentGroup.includes(studentEmail)) {
                return currentGroup.filter(email => email !== studentEmail);
            }
            else {
                // Add student to end of array
                return [...currentGroup, studentEmail];
            }
        })
    }

    const formGroup = async (e) => {
        e.preventDefault(); // Prevent page reload
    
        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            if (!token) {
                alert("No token found. Please log in.");
                return;
            }
    
            const decodedToken = jwtDecode(token); // Decode the JWT token
            const { userId } = decodedToken; // Extract email from the token
    
            if (!groupName || groupMembers.length === 0) {
                alert("Group name and at least one member are required.");
                return;
            }
    
            alert(`Creating group "${groupName}"\nGroup members: ${groupMembers.join(', ')}`);
    
            // Send group data to the server
            const response = await axios.post('http://localhost:5050/api/create-team', {
                groupName,
                groupMembers,
                userId,
            }, {
                withCredentials: true,
            });
    
            if (response.status === 201) {
                alert("Group created successfully!");
    
                // Add the new group to the existing state
                setGroups((currentGroups) => [
                    ...currentGroups,
                    { groupID: Date.now(), members: groupMembers },
                ]);
    
                // Disable the checkboxes of grouped students
                setStudentsAsGrouped((studentsInGroups) => [
                    ...studentsInGroups,
                    ...groupMembers,
                ]);
    
                // Clear the group members and name inputs
                setGroupMembers([]);
                setGroupName('');
            } else {
                throw new Error(response.data.message || "Failed to create group.");
            }
        } catch (err) {
            alert(`Error: ${err.message || err}`);
            console.error(err); // Log error for debugging
        }
    };
    
    

    return(
        <div className="GroupForm-form">
        <h3>Form Groups</h3>
        <section className="GroupForm-checklist">
        <StudentChecklist students={students} selectionHandler={selectionHandler} selectedStudents={groupedStudents}/>
        </section>

        <div className="form-group">
        <label>Enter Group Name:</label>
        <input
            type="text"
            id="groupName"
            className="form-control"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)} // Update groupName state
            placeholder="Group Name"
        />
        </div>
        <br/>

        <Button buttonText="Create Group" buttonColor="btn btn-secondary" onClick={formGroup} disabled={groupMembers.length === 0 || groupName === ''}/>
        </div>
    );
}

export default GroupForm;