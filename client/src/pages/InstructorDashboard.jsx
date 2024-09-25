import "./InstructorDashboard.css";
import TabBar from "../components/TabContainer";
import StudentTable from "../components/StudentTable";
import Button from "../components/Button";
import SingleFileUploader from "../components/SingleFileUploader";

const InstructorDashboard = (props) => {

  // Placeholders: replace with headers from database
  const tableHeaders = [
    {id: "fname", title:"First Name"},
    {id: "lname", title:"Last Name"},
    {id: "email", title:"Email"},
    {id: "studentID", title:"Student ID"},
    {id: "phone", title:"Phone Number"}
  ]

  // Placeholders: Load this info on the server side
  const students = [
    { fname: "Liam", lname: "Nguyen", email: "liam.nguyen@live.concordia.ca", studentID: "001", phone: "438 1112345" },
    { fname: "Ava", lname: "Martinez", email: "ava.martinez@live.concordia.ca", studentID: "002", phone: "438 2223456" },
    { fname: "Omar", lname: "Khan", email: "omar.khan@live.concordia.ca", studentID: "003", phone: "438 3334567" },
    { fname: "Zara", lname: "Patel", email: "zara.patel@live.concordia.ca", studentID: "004", phone: "438 4445678" },
    { fname: "Noah", lname: "Garcia", email: "noah.garcia@live.concordia.ca", studentID: "005", phone: "438 5556789" },
    { fname: "Maya", lname: "Singh", email: "maya.singh@live.concordia.ca", studentID: "006", phone: "438 6667890" },
    { fname: "Ethan", lname: "Chen", email: "ethan.chen@live.concordia.ca", studentID: "007", phone: "438 7778901" },
    { fname: "Sophia", lname: "Lee", email: "sophia.lee@live.concordia.ca", studentID: "008", phone: "438 8889012" },
    { fname: "Isaac", lname: "Hernandez", email: "isaac.hernandez@live.concordia.ca", studentID: "009", phone: "438 9990123" },
    { fname: "Aria", lname: "Wang", email: "aria.wang@live.concordia.ca", studentID: "010", phone: "438 0001234" },
    { fname: "Mateo", lname: "Lopez", email: "mateo.lopez@live.concordia.ca", studentID: "011", phone: "438 1112346" },
    { fname: "Layla", lname: "Rodriguez", email: "layla.rodriguez@live.concordia.ca", studentID: "012", phone: "438 2223457" },
    { fname: "Jackson", lname: "Gonzalez", email: "jackson.gonzalez@live.concordia.ca", studentID: "013", phone: "438 3334568" },
    { fname: "Emily", lname: "Martinez", email: "emily.martinez@live.concordia.ca", studentID: "014", phone: "438 4445679" },
    { fname: "Lucas", lname: "Thomas", email: "lucas.thomas@live.concordia.ca", studentID: "015", phone: "438 5556780" },
    { fname: "Sofia", lname: "Anderson", email: "sofia.anderson@live.concordia.ca", studentID: "016", phone: "438 6667891" },
    { fname: "Benjamin", lname: "Taylor", email: "benjamin.taylor@live.concordia.ca", studentID: "017", phone: "438 7778902" },
    { fname: "Chloe", lname: "Wilson", email: "chloe.wilson@live.concordia.ca", studentID: "018", phone: "438 8889013" },
    { fname: "Daniel", lname: "Davis", email: "daniel.davis@live.concordia.ca", studentID: "019", phone: "438 9990124" },
    { fname: "Mia", lname: "Garcia", email: "mia.garcia@live.concordia.ca", studentID: "020", phone: "438 0001235" }
];



  const tabsData = [
    { id: "students", 
      label: "Students", 
      content: 
        <div class="Dashboard-contents">
          {/*<StudentTable tableContents={{ headers: tableHeaders, contents: students}}/>*/}
          <SingleFileUploader fileDescription="Course Roster" fileExtension=".csv"/>
        </div> 
    },
    { id: "groups", 
      label: "Groups", 
      content: 
        <div class="Dashboard-contents">
          Groups go here
        </div> },
    {
      id: "assessments",
      label: "Assessments",
      content: 
        <div class="Dashboard-contents"> 
          Peer assessments go here
        </div>,
    },
  ];


  return (
    <>
      <h1 class="Dashboard-header">Course Name</h1>
      <div>
      <TabBar tabs={tabsData} />
      </div>

      <Button buttonText="Don't Press" buttonColor="btn btn-danger" />
    </>
  );
};

export default InstructorDashboard;
