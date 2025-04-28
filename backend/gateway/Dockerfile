# Utiliser une image Node officielle
FROM node:20

# Définir le dossier de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port HTTPS (3000)
EXPOSE 3000

# Commande pour démarrer le gateway
CMD ["npm", "run", "dev"]
