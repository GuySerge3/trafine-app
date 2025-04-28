module.exports = function checkRole(...allowedRoles) {
    return (req, res, next) => {
      const user = req.user;
  
      if (!user) {
        return res.status(401).json({ message: 'Non authentifié' });
      }
  
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Accès interdit: rôle insuffisant' });
      }
  
      next(); // ✅ autorisé
    };
  };
  