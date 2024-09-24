import TabBar from "../components/TabContainer";

const InstructorDashboard = () => {
  const tabsData = [
    { id: 'students', label: 'Students', content: <div>Course roster</div> },
    { id: 'groups', label: 'Groups', content: <div>Groups</div> },
    { id: 'assessments', label: 'Assessments', content: <div>Peer assessments go here</div> }
  ];

  return (
    <>
    <h1>Course Name</h1>
    <TabBar tabs={tabsData}/>
    </>
  );
}

export default InstructorDashboard;
