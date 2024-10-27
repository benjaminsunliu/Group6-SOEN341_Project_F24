// TODO: Figure out how to combine students and selectionHandler as prop
const StudentChecklist = ({ students, selectionHandler, selectedStudents }) => {
    return (
        <>
            {students.map((student) => (
                <div className="form-check" key={student.studentID}>
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        value={student.email} // Change to use email instead of studentID
                        id={`checkbox-${student.studentID}`} // Ensure unique IDs for each checkbox
                        onChange={selectionHandler}
                        disabled={Array.isArray(selectedStudents) && selectedStudents.includes(student.email)} // Check if email is already selected
                    />
                    <label className="form-check-label" htmlFor={`checkbox-${student.studentID}`}>
                        {`${student.fname} ${student.lname}`} {/* Display only the name */}
                    </label>
                </div>
            ))}
        </>
    );
}

export default StudentChecklist;
