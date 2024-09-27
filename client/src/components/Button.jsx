const Button = (props) => {
  return (
    <button className={props.buttonColor} onClick={props.onClick}>
      {props.buttonText}
    </button>
  );
};

export default Button;
