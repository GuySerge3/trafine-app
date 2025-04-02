import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Bienvenue sur SUPMAP</h1>
      <Link to="/map"><button>Voir la Carte</button></Link>
      <Link to="/login"><button>Se Connecter</button></Link>
    </div>
  );
};

export default Home;
