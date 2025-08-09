const http = require('http');

async function testSignup() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: "Frontend Test User",
      email: "frontend-test@example.com",
      password: "password123",
      phone: "1234567890"
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

    console.log('🧪 Testing signup API...');
    console.log('📧 Email: frontend-test@example.com');

    const req = http.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode} ${res.statusMessage}`);
      
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseBody);
          console.log('✅ Response:', JSON.stringify(jsonResponse, null, 2));
          resolve({ status: res.statusCode, data: jsonResponse });
        } catch (e) {
          console.log('❌ Raw response:', responseBody);
          resolve({ status: res.statusCode, data: responseBody });
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ Error:', e.message);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

testSignup().then((result) => {
  if (result.status === 201) {
    console.log('\n🎉 Signup API is working correctly!');
    console.log('✅ User account created successfully');
  } else {
    console.log('\n❌ Signup failed with status:', result.status);
  }
}).catch(console.error);
