import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {MapPin, Mail, Lock, User } from "lucide-react";
import "../styles/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'inscription");

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="register-wrapper">
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <User size={20} color="#fff" />
          <MapPin size={20} color="#3b82f6" />
          <span><strong>SUPMAP</strong></span>
        </div>
        <nav className="nav">
         
        </nav>
      </header>

      {/* FORM */}
      <main className="register-container">
        <form className="register-card" onSubmit={handleRegister}>
          <h2>Inscription</h2>

          <div className="input-group">
            <Mail className="icon" />
            <input
              type="email"
              placeholder="Email"
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

          <div className="input-group">
            <Lock className="icon" />
            <input
              type="password"
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="checkbox-row">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              J’accepte les <span>Conditions générales</span>
            </label>
          </div>

          <button type="submit" className="btn-register">
            Créer un compte
          </button>

          <div className="login-link">
            Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
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

export default Register;
