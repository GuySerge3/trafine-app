import React from "react";
import { Link } from "react-router-dom";
import { Navigation, MapPin } from "lucide-react";
import "../styles/Home.css"; // Assure-toi que ce chemin est correct

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <MapPin size={20} color="#3b82f6" />
          <span><strong>SUPMAP</strong></span>
        </div>
        <nav className="nav">
          
        </nav>
        <div>
          <Link to="/login" className="login-btn">Connexion</Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="home-container">
        <div className="home-left">
          <h1>
            <span>Explorez avec</span> <strong className="highlight">SUPMAP</strong>
          </h1>
          <p>
            Découvrez des lieux, trouvez votre chemin et explorez de nouvelles
            destinations avec notre application de cartographie intuitive.
          </p>
          <div className="home-buttons">
            <Link to="/login" className="btn btn-primary">Se connecter</Link>
          </div>
        </div>

        <div className="home-right">
          <div className="image-box">
          <img
                src="/placeholder.svg?height=400&width=600&text=Map+Preview"
                alt="Aperçu de la carte"
          />

          </div>
          <div className="floating-icon">
            <Navigation color="#3b82f6" size={28} />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} SUPMAP. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;