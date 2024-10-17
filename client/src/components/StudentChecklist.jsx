// TODO: Figure out how to combine students and selectionHandler as prop
const StudentChecklist = ({ students, selectionHandler, selectedStudents}) => {
    return (
        <>
        {students.map((student) =>
            <div class="form-check" key={student.studentID}>
            <input 
                class="form-check-input" 
                type="checkbox" 
                value={student.studentID} 
                id="flexCheckDefault" 
                onChange={selectionHandler}
                disabled={Array.isArray(selectedStudents) && selectedStudents.includes(student.studentID)}
            />
            <label class="form-check-label" for="flexCheckDefault">
                {`${student.fname} ${student.lname} ${student.studentID}`}
            </label>
            </div>
        )}
        </>
    );
}

export default StudentChecklist;