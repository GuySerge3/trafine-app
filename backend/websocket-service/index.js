const WebSocket = require('ws');
const http = require('http');

// Créer un serveur HTTP
const server = http.createServer();

// Créer un serveur WebSocket
const wss = new WebSocket.Server({ server });

// Quand un client se connecte au serveur WebSocket
wss.on('connection', (ws) => {
  console.log('Un client est connecté');
  
  // Écouter les messages du client
  ws.on('message', (message) => {
    console.log(`Reçu: ${message}`);
  });

  // Envoyer un message au client
  ws.send('Bienvenue sur le serveur WebSocket!');
});

// Démarrer le serveur HTTP (qui gère WebSocket aussi)
server.listen(5000, () => {
  console.log('Serveur WebSocket en écoute sur le port 5000');
});
