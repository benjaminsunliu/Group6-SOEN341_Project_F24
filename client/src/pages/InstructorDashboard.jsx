import TabBar from "../components/TabContainer";
import Button from "../components/Button";

const InstructorDashboard = (props) => {
  const tabsData = [
    { id: "students", label: "Students", content: <div>Course roster</div> },
    { id: "groups", label: "Groups", content: <div>Groups</div> },
    {
      id: "assessments",
      label: "Assessments",
      content: <div>Peer assessments go here</div>,
    },
  ];

  return (
    <>
      <h1>Course Name</h1>
      <TabBar tabs={tabsData} />
      <Button buttonText="Don't Press" buttonColor="btn btn-danger" />
    </>
  );
};

export default InstructorDashboard;
