import InstructorDashboard from "../pages/InstructorDashboard";
import Button from "./Button";
import CollapsableButton from "./CollapsableButton";
const GroupList = ({ text, students }) => {
  let groupSize = 11;
  let numOfGroups = students.length / groupSize;
  let arrayOfGroups = [];

  for (let i = 1; i <= numOfGroups; i++) {
    arrayOfGroups.push(i);
  }

  //   all variables and functions above this comment are just temporary until we can get the information from the DB itself
  //   would need to implement a useEffect hook

  return (
    <>
      <table
        className="table table-default table-hover"
        style={{ textAlign: "center" }}
      >
        <tbody>
          <tr>
            <h3>Groups</h3>
          </tr>
          {arrayOfGroups.map((item, index) => (
            // would use group name or something else as the key w=once we can access the database
            <tr key={item}>
              <div style={{ margin: "1px" }}>
                <CollapsableButton
                  // once we can fetch group names from database change the buttonText to the actual group name
                  buttonText={"Groups"}
                  buttonColor="btn btn-primary"
                />
              </div>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GroupList;
