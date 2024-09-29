import { useState } from "react";
const CollapsableButton = (props) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  let content;

  if (clicked == false)
    content = (
      <button onClick={handleClick} className={props.buttonColor}>
        {props.buttonText}
      </button>
    );
  else
    content = (
      <div>
        <button onClick={handleClick} className={props.buttonColor}>
          {props.buttonText}
        </button>
        <table
          className="table table-default table-hover"
          style={{ textAlign: "center" }}
        >
          {/* once we can access the database we would put a map function here to retrun a table row for each group member
            for now I'm just going to put group members */}
          <tr>list of group members 🤯</tr>
        </table>
      </div>
    );

  return <>{content}</>;
};
export default CollapsableButton;
