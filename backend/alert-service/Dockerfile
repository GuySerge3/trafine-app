FROM node:18

# Créer le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances et les installer
COPY package*.json ./
RUN npm install

# Copier tout le code source
COPY . .

# Démarrer l'application avec nodemon (mode dev)
CMD ["npm", "run", "dev"]
