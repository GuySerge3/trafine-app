const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Vérification si le token est présent dans l'en-tête Authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  // Récupération du token Bearer
  const token = authHeader.split(' ')[1];

  try {
    // Décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attacher l'utilisateur décodé à `req.user`
    req.user = decoded;
    
    // Passer au prochain middleware
    next();
  } catch (error) {
    console.error("Erreur de validation du token :", error);  // Log de l'erreur
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
};
