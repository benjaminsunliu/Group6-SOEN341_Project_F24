const Footer = (props) => {
  return (
    <footer
      className="mt-auto text-black-50"
      style={{ backgroundColor: "#f4c109",
      zIndex: "1",
      position: "sticky",
      bottom: "0",
      clear: "both",
      marginTop: "auto",
      paddingBottom: "5px",
      paddingTop: "5px",
      textAlign: "center",
      width: "100%",
      }}
    >
      {/* in line css in jsx need double curly brackets*/}
      <p>SOEN 341 project group 6</p>
    </footer>
  );
};

export default Footer;
