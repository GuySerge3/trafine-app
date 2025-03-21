module.exports = (roles) => {
    return (req, res, next) => {
      console.log("🚀 Utilisateur connecté dans checkRole:", req.user); // 🔍 Affiche les infos de l'utilisateur
  
      if (!req.user.role) {
        console.log("❌ Aucun rôle détecté !");
        return res.status(403).json({ message: "Accès refusé. Aucun rôle défini." });
      }
  
      if (!roles.includes(req.user.role)) {
        console.log(`❌ Accès refusé. Rôle actuel : ${req.user.role}, Rôles requis : ${roles}`);
        return res.status(403).json({ message: "Accès refusé. Permission insuffisante." });
      }
  
      console.log("✅ Accès autorisé !");
      next();
    };
  };
  