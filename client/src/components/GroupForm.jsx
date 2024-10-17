import StudentChecklist from "./StudentChecklist";
import Button from "./Button";
import "./GroupForm.css"
import { useState } from "react";

const GroupForm = ({ students }) => {

    const [groupMembers, setGroupMembers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [groups, setGroups] = useState([]);
    const [groupedStudents, setStudentsAsGrouped] = useState([]);

    const selectionHandler = (e) => { 

        const studentID = e.target.value;
        setGroupMembers((currentGroup) => {
            // If student is already in that group, then remove them
            if(currentGroup.includes(studentID)) {
                return currentGroup.filter(id => id !== studentID);
            }
            else {
                // Add student to end of array
                return [...currentGroup, studentID];
            }
        })
    }

    const formGroup = () => {

        // TODO: Server-side logic for group creation

        if(groupMembers.length > 0) {
            setGroups((currentGroups) => {
                alert(`Creating group "${groupName}"\nGroup members: ${groupMembers.join(', ')}`);
                return [...currentGroups, {groupID: Date.now(), members: groupMembers}]
            })

            // Used to disable the checkboxes of grouped students
            setStudentsAsGrouped((studentsInGroups) => [...groupedStudents, ...groupMembers]) 

            // Clear temporary group members array
            setGroupMembers([]);
            setGroupName('');
        }
    }

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