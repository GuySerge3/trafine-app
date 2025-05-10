const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Liste des services Node.js
const services = [
  { name: 'auth-service', port: 3001 },
  { name: 'user-service', port: 3002 },
  { name: 'route-service', port: 3003 },
  { name: 'incident-service', port: 3004 },
  { name: 'alert-service', port: 3005 },
  { name: 'stats-service', port: 3006 },
];

// 🔁 Démarrer tous les services Node.js
services.forEach(service => {
  const servicePath = path.join(__dirname, 'backend', service.name);

  

  // Étape 2 : Démarrer le service en mode dev
  const child = spawn('npm', ['run', 'dev'], {
    cwd: servicePath,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env }
  });

  console.log(`🚀 Lancement de ${service.name} depuis ${servicePath}`);
});

// 🚪 Démarrer le gateway-service
const gatewayPath = path.join(__dirname, 'backend', 'gateway');
if (fs.existsSync(path.join(gatewayPath, 'package.json'))) {
  console.log(`📦 Installation des dépendances pour gateway-service...`);
  spawn('npm', ['install'], {
    cwd: gatewayPath,
    shell: true,
    stdio: 'inherit'
  });
}
const gateway = spawn('npm', ['run', 'dev'], {
  cwd: gatewayPath,
  shell: true,
  stdio: 'inherit',
  env: { ...process.env }
});
console.log(`🚪 Lancement de gateway-service depuis ${gatewayPath}`);

// 🤖 Lancer le ai-service en Python
const aiServicePath = path.join(__dirname, 'backend', 'ai-service');
const python = process.platform === 'win32' ? 'python' : 'python3';
const ai = spawn(python, ['-m', 'uvicorn', 'app:app', '--reload', '--port', '5000'], {
  cwd: aiServicePath,
  shell: true,
  stdio: 'inherit',
  env: { ...process.env }
});
console.log(`🤖 Lancement de ai-service depuis ${aiServicePath}`);
