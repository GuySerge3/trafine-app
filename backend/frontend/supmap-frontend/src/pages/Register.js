import React, { useState } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      return setErrorMessage("Les mots de passe ne correspondent pas.");
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur d'inscription");
      }

      setSuccessMessage("Inscription réussie. Vous pouvez vous connecter !");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Inscription</h2>

        {errorMessage && (
          <Alert variant="danger" className="text-center">{errorMessage}</Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="text-center">{successMessage}</Alert>
        )}

        <Form onSubmit={handleRegister}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Entrez un mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="mt-3">
            <Form.Label>Confirmer le mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="mt-4 w-100">
            S'inscrire
          </Button>
        </Form>

        <div className="text-center mt-3">
          <span>Vous avez déjà un compte ? </span>
          <Link to="/login">Connectez-vous</Link>
        </div>
      </div>
    </Container>
  );
};

export default Register;
