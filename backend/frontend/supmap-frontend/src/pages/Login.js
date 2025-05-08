import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Mail, Lock, User } from "lucide-react";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Identifiants invalides");
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/map");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-wrapper">
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <MapPin size={20} color="#3b82f6" />
          <span><strong>SUPMAP</strong></span>
        </div>
        <nav className="nav">
        
        </nav>
        <div>
        
        </div>
      </header>

      {/* FORM */}
      <main className="login-glass-wrapper">
        <form className="login-glass" onSubmit={handleLogin}>
          <div className="login-avatar">
            <User size={40} />
          </div>
          <h2>Connexion</h2>

          <div className="input-group">
            <Mail className="icon" />
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="icon" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">Se connecter</button>

          <div className="login-options">
            <label>
              <input type="checkbox" /> Se souvenir de moi
            </label>
            <Link to="/forgot">Mot de passe oublié ?</Link>
          </div>

          <div className="register-link">
            Pas de compte ? <Link to="/register">Créer un compte</Link>
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} SUPMAP. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Login;
