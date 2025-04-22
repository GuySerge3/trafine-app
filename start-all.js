const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'auth-service', port: 3001 },
  { name: 'user-service', port: 3002 },
  { name: 'route-service', port: 3003 },
  { name: 'incident-service', port: 3004 },
  { name: 'alert-service', port: 3005 },
  { name: 'stats-service', port: 3006 }
];

// 🔁 Démarrer tous les services Node.js
services.forEach(service => {
  const servicePath = path.join(__dirname, 'backend', service.name);
  const child = spawn('npm', ['run', 'dev'], {
    cwd: servicePath,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env }
  });

  console.log(`🚀 Lancement de ${service.name} depuis ${servicePath}`);
});

// 🤖 Lancer le ai-service en Python (FastAPI)
const aiServicePath = path.join(__dirname, 'backend', 'ai-service');
const python = process.platform === 'win32' ? 'python' : 'python3';

const ai = spawn(python, ['-m', 'uvicorn', 'app:app', '--reload', '--port', '5000'], {
  cwd: aiServicePath,
  shell: true,
  stdio: 'inherit',
  env: { ...process.env }
});

console.log(`🤖 Lancement de ai-service depuis ${aiServicePath}`);
