import "./styles.css";
const Home = (props) => {
  return (
    <>
      <div class="body" className="body">
        <h1 className="home">Welcome to RateMyChillmates! </h1>
        <img src="./images/home.png" alt="home" width="500"/>
        <br/>
        <p class="home" className="home">
        This is a platform where students can rate their peers based on their performance in group projects. This platform is designed to help students find the best group members for their projects.
        </p>
        
      </div>
    </>
  );
};

export default Home;
