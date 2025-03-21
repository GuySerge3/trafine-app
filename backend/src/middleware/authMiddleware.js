const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    console.log("❌ Aucun token reçu !");
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    console.log("🔍 Token décodé :", decoded); // ✅ Vérifie si le rôle est bien présent
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Erreur lors de la vérification du token :", error.message);
    res.status(403).json({ message: "Token invalide." });
  }
};
