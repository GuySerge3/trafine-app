const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'auth-service', port: 3001 },
  { name: 'user-service', port: 3002 },
  { name: 'route-service', port: 3003 },
  { name: 'incident-service', port: 3004 },
  { name: 'alert-service', port: 3005 }
];

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
