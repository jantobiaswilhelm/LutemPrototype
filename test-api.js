const http = require('http');

const data = JSON.stringify({
  availableMinutes: 30,
  desiredEmotionalGoals: ["UNWIND"],
  currentEnergyLevel: "LOW",
  requiredInterruptibility: "HIGH",
  socialPreference: "SOLO"
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/recommendations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', e => console.error('Error:', e.message));
req.write(data);
req.end();
