// this collapsable button component will expand and display the contents of the array passed to it
import { useState } from "react";

const CollapsableButton = (props) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <>
      <div class="d-grid gap-2">
        <button onClick={handleClick} className={props.buttonColor}>
          {props.buttonText}
        </button>
      </div>

      {clicked && (
        <div>
          {
            <table
              className="table table-default table-hover"
              style={{ textAlign: "center", marginTop: "1rem" }}
            >
              <tbody>
                {props.buttonArray.map((element, index) => (
                  <tr key={index}>{element}</tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      )}
    </>
  );
};

export default CollapsableButton;
