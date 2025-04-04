// final-mongodb-test.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testMongoDBConnection() {
  console.log('🔍 Final MongoDB Connection Test');
  
  // IMPORTANT: Replace these with your actual MongoDB credentials
  const username = "simeonngalamou"; // REPLACE THIS with your actual username
  const password = "EsXYn0AlB5Seo1Sg"; // REPLACE THIS with your actual password
  
  // Direct connection string using shard nodes
  const connectionString = `mongodb://${username}:${password}@ac-xgyfopa-shard-00-00.a2ljz4c.mongodb.net:27017,ac-xgyfopa-shard-00-01.a2ljz4c.mongodb.net:27017,ac-xgyfopa-shard-00-02.a2ljz4c.mongodb.net:27017/admin?authSource=admin`;
  
  console.log('Using direct connection with correct option names');
  
  // Minimal client options with correct property names
  const options = {
    connectTimeoutMS: 30000,
    ssl: true,
    // The correct option is tlsAllowInvalidCertificates, not sslValidate
    tlsAllowInvalidCertificates: true,
    // The correct option is tlsAllowInvalidHostnames, not checkServerIdentity
    tlsAllowInvalidHostnames: true,
    directConnection: false
  };
  
  let client;
  try {
    console.log('Attempting to connect...');
    client = new MongoClient(connectionString, options);
    await client.connect();
    
    console.log('✅ Connection successful!');
    
    // Verify access by listing databases
    console.log('Listing databases...');
    const adminDb = client.db('admin');
    const result = await adminDb.admin().listDatabases();
    
    console.log('📋 Available databases:');
    result.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error name:', error.name);
    
    if (error.name === 'MongoParseError') {
      console.error('\n📝 Option Error:');
      console.error('Invalid option name detected. Checking your MongoDB driver version:');
      try {
        const mongodbPackage = require('mongodb/package.json');
        console.error('MongoDB driver version:', mongodbPackage.version);
        
        if (mongodbPackage.version.startsWith('3.')) {
          console.error('You are using MongoDB driver v3.x - different options may be required.');
          console.error('Try using these options instead:');
          console.error('  ssl: true,');
          console.error('  sslValidate: false,');
          console.error('  checkServerIdentity: false,');
        } else if (mongodbPackage.version.startsWith('4.')) {
          console.error('You are using MongoDB driver v4.x - try with these options:');
          console.error('  tls: true,');
          console.error('  tlsAllowInvalidCertificates: true,');
          console.error('  tlsAllowInvalidHostnames: true,');
        }
      } catch (packageError) {
        console.error('Could not determine MongoDB driver version');
      }
    }
    else if (error.message.includes('Authentication failed')) {
      console.error('\n🔑 Authentication Error:');
      console.error('1. Double-check your username and password');
      console.error('2. Verify that your database user exists in MongoDB Atlas');
      console.error('3. Ensure the username is correct (case sensitive)');
    } 
    else if (error.message.includes('timed out')) {
      console.error('\n⏱️ Connection Timeout:');
      console.error('1. Make sure your IP address is whitelisted in MongoDB Atlas');
      console.error('2. Check if your firewall is blocking the connection');
      console.error('3. Try connecting from a different network');
    }
    else if (error.message.includes('ssl') || error.message.includes('TLS') || error.message.includes('handshake')) {
      console.error('\n🔐 SSL/TLS Error:');
      console.error('1. Try MongoDB Compass to test if it works with GUI client');
      console.error('2. Check if your network is intercepting SSL traffic');
      console.error('3. Try connecting from a different network or VPN');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('Connection closed');
    }
  }

  console.log('\n💡 If all connection attempts fail, try these alternatives:');
  console.log('1. Use MongoDB Compass (GUI client) to test connection');
  console.log('2. Try connecting from a different network');
  console.log('3. Verify your cluster is running in MongoDB Atlas');
  console.log('4. Create a new database user with a simple password');
  console.log('5. Temporarily whitelist all IPs (0.0.0.0/0) for testing');
}

// Check MongoDB driver version first
try {
  const mongodbPackage = require('mongodb/package.json');
  console.log('MongoDB Driver Version:', mongodbPackage.version);
} catch (err) {
  console.log('Could not determine MongoDB driver version');
}

testMongoDBConnection().catch(console.error);