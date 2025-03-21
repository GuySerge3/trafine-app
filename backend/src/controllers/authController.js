const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");


let refreshTokens = [];


const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};


const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET_REFRESH, { expiresIn: "7d" });
};


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "L'utilisateur existe déjà" });

        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Identifiants invalides" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        refreshTokens.push(refreshToken); 
        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};


exports.refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Refresh Token requis" });
    if (!refreshTokens.includes(token)) return res.status(403).json({ message: "Token invalide" });

    jwt.verify(token, process.env.JWT_SECRET_REFRESH, (err, user) => {
        if (err) return res.status(403).json({ message: "Token expiré ou invalide" });

        const newAccessToken = generateAccessToken(user.id);
        res.json({ accessToken: newAccessToken });
    });
};


exports.logout = (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.json({ message: "Déconnexion réussie" });
};

module.exports = { generateAccessToken, generateRefreshToken };
