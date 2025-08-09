const http = require('http');

const data = JSON.stringify({
  name: "New Test User",
  email: "newtest@example.com", 
  password: "password123",
  phone: "9876543210"
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Testing signup API...');
console.log('Request data:', data);

const req = http.request(options, (res) => {
  console.log(`\nStatus: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}`);
  
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('\n--- Response Body ---');
    try {
      const jsonResponse = JSON.parse(responseBody);
      console.log(JSON.stringify(jsonResponse, null, 2));
    } catch (e) {
      console.log('Raw response:', responseBody);
    }
  });
});

req.on('error', (e) => {
  console.error(`\nError: ${e.message}`);
});

req.write(data);
req.end();
