const http = require('http');

// Test multiple users to ensure consistency
const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    phone: "1234567890"
  },
  {
    name: "Jane Smith", 
    email: "jane.smith@example.com",
    password: "password456",
    phone: "0987654321"
  }
];

async function testSignup(userData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(userData);
    
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
    
    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: responseBody,
          user: userData.email
        });
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Signup API Consistency...\n');
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    try {
      console.log(`Testing user ${i + 1}: ${user.email}`);
      const result = await testSignup(user);
      
      if (result.status === 201) {
        console.log('✅ SUCCESS - User created successfully');
        const response = JSON.parse(result.body);
        console.log(`   Name: ${response.name}`);
        console.log(`   Email: ${response.email}`);
      } else if (result.status === 409) {
        console.log('⚠️  USER EXISTS - Email already registered');
      } else {
        console.log(`❌ FAILED - Status: ${result.status}`);
        console.log(`   Response: ${result.body}`);
      }
    } catch (error) {
      console.log(`❌ ERROR - ${error.message}`);
    }
    console.log('');
  }
  
  console.log('🏁 Signup API test completed');
}

runTests();
