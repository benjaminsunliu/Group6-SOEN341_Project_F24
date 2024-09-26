const StudentChecklist = ({ students, selectionHandler }) => {
    return (
        <>
        {students.map((student) =>
            <div class="form-check" key={student.studentID}>
            <input class="form-check-input" type="checkbox" value={student.studentID} id="flexCheckDefault" onChange={selectionHandler}/>
            <label class="form-check-label" for="flexCheckDefault">
                {`${student.fname} ${student.lname} ${student.studentID}`}
            </label>
            </div>
        )}
        </>
    );
}

export default StudentChecklist;