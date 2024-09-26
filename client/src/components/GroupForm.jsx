import StudentChecklist from "./StudentChecklist";
import Button from "./Button";
import "./GroupForm.css"
import { useState } from "react";

const GroupForm = ({ students }) => {

    const [groupMembers, setGroupMembers] = useState([]);
    const [groups, setGroups] = useState([]);

    const selectionHandler = (e) => {
        // TODO: Add cooldown to this, I noticed that the else is sometimes executing twice
        const studentID = e.target.value;
        setGroupMembers((currentGroup) => {
            // If student is already in that group, then remove them
            if(currentGroup.includes(studentID)) {
                alert(`Removed student ${e.target.value} from groups`);
                return currentGroup.filter(id => id !== studentID);
            }
            else {
                // Add student to end of array
                alert(`Added student ${e.target.value} to groups`);
                return [...currentGroup, studentID];
            }
        })
    }

    const formGroup = () => {
        
        // TODO: Server-side logic for group creation

        if(groupMembers.length > 0) {
            setGroups((currentGroups) => {
                alert(`Creating group ${Date.now()}`);
                return [...currentGroups, {groupID: Date.now(), members: groupMembers}]
            })
            // Clear temporary group members array
            setGroupMembers([]);
        }
    }

    return(
        <div className="GroupForm-form">
        <h3>Form Groups</h3>
        <section className="GroupForm-checklist">
        <StudentChecklist students={students} selectionHandler={selectionHandler}/>
        </section>
        <Button buttonText="Create Group" buttonColor="btn btn-secondary" onClick={formGroup}/>
        </div>
    );
}

export default GroupForm;