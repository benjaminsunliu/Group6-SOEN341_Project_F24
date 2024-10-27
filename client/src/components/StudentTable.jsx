const StudentTable = ({ tableContents }) => {
    const headers = tableContents.headers;
    const contents = tableContents.contents;
  
    return (
      <table className="table table-striped" style={{ textAlign: "left" }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.id}>{header.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contents.map((content) => (
            <tr key={content.studentID}>
              {headers.map((header) => (
                <td key={header.id}>
                  {/* Check if the header is for members and join them with commas */}
                  {Array.isArray(content[header.id])
                    ? content[header.id].join(", ")
                    : content[header.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default StudentTable;
  