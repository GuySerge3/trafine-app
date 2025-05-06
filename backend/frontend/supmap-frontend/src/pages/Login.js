import React, { useState } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur de connexion");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/map");
    } catch (error) {
      console.error("Erreur :", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Connexion</h2>
        {errorMessage && (
          <Alert variant="danger" className="text-center">{errorMessage}</Alert>
        )}
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4 w-100">
            Se connecter
          </Button>
        </Form>

        <div className="text-center mt-3">
          <span>Vous n'avez pas de compte ? </span>
          <Link to="/register">Inscrivez-vous</Link>
        </div>
      </div>
    </Container>
  );
};

export default Login;
