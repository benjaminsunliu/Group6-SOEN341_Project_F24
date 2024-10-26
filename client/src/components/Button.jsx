const Button = (props) => {
  return (
    <button className={props.buttonColor} onClick={props.onClick} disabled={props.disabled}>
      {props.buttonText}
    </button>
  );
};

export default Button;
